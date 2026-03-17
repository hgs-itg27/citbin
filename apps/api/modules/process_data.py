from typing import Dict, Any, Optional
from sqlmodel import Session, select
from models.device import Device
from models.trashbin_data import DataLog
from models.trashbin import Trashbin
import logging
import json
from modules.sensor_factory import SensorFactory
from modules.trashbin_factory import TrashbinFactory    

def parse_sensor_payload(payload: Dict[str, Any]) -> Dict[str, Optional[Any]]:
    """
    Extrahiert Sensordaten aus einem ChirpStack-kompatiblen Webhook-Payload.

    Gibt ein Dictionary zurück mit:
    - devEui
    - profile_name
    - timestamp
    - object
    - full_payload (für optionale Speicherung)
    """

    # Device Info auslesen
    device_info = payload.get("deviceInfo", {})
    profile_name = device_info.get('deviceProfileName')

    # Zeitstempel (falls vorhanden)
    timestamp = payload.get("time")

    # Entschlüsselte Sensordaten (aus 'object')
    obj = payload.get("object", {})
    devEui = device_info.get("devEui")

    return {
        "devEui": devEui,
        'profile_name': profile_name,
        "timestamp": timestamp,
        'object': obj,
        "full_payload": payload  # Optional: für Logging oder Speicherung
    }

def save_sensor_data(db, data: Dict[str, Any]):
    if not data.get('devEui', None):
        return
    devEui = data['devEui']

    if not bool(data.get('object')):
        logging.info(f'Received data from device (devEui: {devEui}) without \'object\' contents -> no further processing')
        return

    with Session(db) as session:
        # Check if device exists in db
        device = session.exec(
            select(Device).where(Device.devEui == devEui)
        ).first()
        if not device:
            logging.info(f'Received data from unknown device (devEui: {devEui}) -> wasn\'t saved in DB')
            return

        # Check if trashbin with device exists in db
        trashbin = session.exec(
            select(Trashbin).where(Trashbin.id == device.trashbin_id)
        ).first()
        if not trashbin:
            logging.info(f'Received data from unattached device(device_id: {device.id}) -> wasn\'t saved in DB')
            return
        
        # Process data
        sensor_profile_name = data.get('profile_name')
        profile = SensorFactory.get_sensor(sensor_profile_name)
        logging.info(f'Using {profile.profile_name} sensor data processing profile')

        trashbin_profile_name = trashbin.type
        trashbin_profile = TrashbinFactory.get_trashbin(trashbin_profile_name)
        if not trashbin_profile:
            logging.error(f'Trashbin profile {trashbin_profile_name} not found for trashbin {trashbin.id}')
            return
        logging.info(f'Using {trashbin_profile.profile_name} trashbin data processing profile')

        obj_data = profile.get_data(data.get('object'))
        obj_data = profile.process_data(obj_data, trashbin_profile)

        # Insert into datalog
        datalog = DataLog(
            trashbin_id=trashbin.id,
            time=data.get('timestamp'),
            payload=json.dumps(data.get('full_payload')),
            distance=obj_data.get('distance'),
            fill_level=obj_data.get('fill_level')
        )
        session.add(datalog)
        session.commit()
        session.refresh(datalog)
        logging.info(f'INSERT datalog: {datalog}')

        # Update device attributes
        device.battery_level = obj_data.get('battery') or device.battery_level
        device.last_seen = datalog.time
        device.latest_data_id = datalog.id
        device.deviceProfileName = sensor_profile_name
        session.add(device)
        session.commit()
        session.refresh(device)
        logging.info(f'UPDATE device: {device}')

        # Update trashbin attribues
        trashbin.last_update_time = datalog.time
        trashbin.latest_data_id = datalog.id
        trashbin.latest_fill_level = datalog.fill_level or trashbin.latest_fill_level
        session.add(trashbin)
        session.commit()
        session.refresh(trashbin)
        logging.info(f'UPDATE trashbin: {trashbin}')

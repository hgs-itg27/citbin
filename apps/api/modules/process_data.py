import datetime
import json
import logging
logger = logging.getLogger(__name__)
from datetime import datetime, timezone
from typing import Any, Optional

from sqlmodel import Session, select

from models.device import Device
from models.trashbin import Trashbin
from models.trashbin_data import DataLog
from modules.sensor_factory import SensorFactory
from modules.trashbin_factory import TrashbinFactory


def parse_sensor_payload(payload: dict[str, Any], devEui: str) -> dict[str, Optional[Any]]:
    """
    Extrahiert Sensordaten aus einem Mioty-kompatiblen MQTT-Payload.

    Gibt ein Dictionary zurück mit:
    - devEui
    - profile_name
    - timestamp
    - object
    - full_payload (für optionale Speicherung)
    """

    # Profilname herausfinden
    profile_name = payload.get("deviceProfileName")

    # Zeitstempel (falls vorhanden)
    timestamp = datetime.now(timezone.utc).isoformat()

    # Entschlüsselte Sensordaten (aus 'object')
    obj = payload

    return {
        "devEui": devEui,
        "profile_name": profile_name,
        "timestamp": timestamp,
        "object": obj,
        "full_payload": payload,  # Optional: für Logging oder Speicherung
    }


def save_sensor_data(db, data: dict[str, Any]):
    if not data.get("devEui", None):
        return
    devEui = data["devEui"]

    if not bool(data.get("object")):
        logger.info("Received data from device (devEui: %s) without object contents, skipping", devEui)
        return

    with Session(db) as session:
        # Check if device exists in db
        device = session.exec(select(Device).where(Device.devEui == devEui)).first()
        if not device:
            logger.info("Received data from unknown device (devEui: %s), discarded", devEui)
            return

        # Check if trashbin with device exists in db
        trashbin = session.exec(select(Trashbin).where(Trashbin.id == device.trashbin_id)).first()
        if not trashbin:
            logger.info("Received data from unattached device (device_id: %s), discarded", device.id)
            return

        # Process data
        sensor_profile_name = data.get("profile_name")
        profile = SensorFactory.get_sensor(sensor_profile_name)
        logger.debug("Using %s sensor data processing profile", profile.profile_name)

        trashbin_profile_name = trashbin.type
        trashbin_profile = TrashbinFactory.get_trashbin(trashbin_profile_name)
        if not trashbin_profile:
            logger.error("Trashbin profile %s not found for trashbin %s", trashbin_profile_name, trashbin.id)
            return
        logger.debug("Using %s trashbin data processing profile", trashbin_profile.profile_name)

        obj_data = profile.get_data(data.get("object"))
        obj_data = profile.process_data(obj_data, trashbin_profile)

        # Insert into datalog
        datalog = DataLog(
            trashbin_id=trashbin.id,
            time=data.get("timestamp"),
            payload=json.dumps(data.get("full_payload")),
            distance=obj_data.get("radar_distance_1"),
            fill_level=obj_data.get("fill_level"),
        )
        session.add(datalog)
        session.commit()
        session.refresh(datalog)
        logger.debug("DataLog inserted: id=%s trashbin_id=%s fill_level=%s", datalog.id, datalog.trashbin_id, datalog.fill_level)

        # Update device attributes
        device.battery_level = obj_data.get("battery_voltage") or device.battery_level
        device.last_seen = datalog.time
        device.latest_data_id = datalog.id
        device.deviceProfileName = sensor_profile_name
        session.add(device)
        session.commit()
        session.refresh(device)
        logger.debug("Device %s updated (battery=%s, last_seen=%s)", device.id, device.battery_level, device.last_seen)

        # Update trashbin attribues
        trashbin.last_update_time = datalog.time
        trashbin.latest_data_id = datalog.id
        trashbin.latest_fill_level = datalog.fill_level or trashbin.latest_fill_level
        session.add(trashbin)
        session.commit()
        session.refresh(trashbin)
        logger.debug("Trashbin %s updated (fill_level=%s)", trashbin.id, trashbin.latest_fill_level)

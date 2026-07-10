import json
import logging
import os
import threading
import time

import paho.mqtt.client as mqtt
from dotenv import load_dotenv
from sqlmodel import Session, select

from dependencies import get_dependencies
from models.device import Device
from modules import payload_decoder, process_data

load_dotenv()

BROKER_ADDRESS = os.getenv("MQTT_HOSTNAME", "citbin.hgs-singen.de")
PORT = int(os.getenv("MQTT_PORT", 1883))

# Aktuell abonnierte Topics
current_topics = set()


def load_topics():
    deps = get_dependencies()
    db = deps["db"]

    with Session(db) as session:
        devices = session.exec(select(Device)).all()

    return {
        f"mioty/00-00-00-00-00-00-00-00/{device.devEui}/uplink"
        for device in devices
        if device.devEui
    }


def refresh_topics(client):
    global current_topics

    try:
        new_topics = load_topics()

        # Neue Topics abonnieren
        for topic in new_topics - current_topics:
            result, _ = client.subscribe(topic)
            if result == mqtt.MQTT_ERR_SUCCESS:
                logging.info(f"Subscribed: {topic}")
            else:
                logging.warning(f"Failed to subscribe: {topic}")

        # Nicht mehr vorhandene Topics abbestellen
        for topic in current_topics - new_topics:
            result, _ = client.unsubscribe(topic)
            if result == mqtt.MQTT_ERR_SUCCESS:
                logging.info(f"Unsubscribed: {topic}")
            else:
                logging.warning(f"Failed to unsubscribe: {topic}")

        current_topics = new_topics

    except Exception:
        logging.exception("Error while refreshing MQTT topics")


def topic_watcher(client):
    while True:
        refresh_topics(client)
        time.sleep(30)  # alle 30 Sekunden prüfen


def on_message(client, userdata, message):
    deps = get_dependencies()

    try:
        msg = json.loads(message.payload.decode("utf-8"))

        logging.info(f"[DEBUG] Mioty Rohdaten empfangen:\n{msg}")

        devEui = message.topic.split("/")[2]
        logging.info(f"DevEui: {devEui}")

        decoded = payload_decoder.decode(msg["data"])

        rxTime = msg["baseStations"][0]["rxTime"]

        parsed = process_data.parse_sensor_payload(
            decoded,
            devEui,
            int(str(rxTime)[:10]),
        )

        process_data.save_sensor_data(deps["db"], parsed)

    except Exception:
        logging.exception("Error while processing MQTT message")


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        logging.info(f"Connected to MQTT Broker: {BROKER_ADDRESS}")

        # Beim Verbinden sofort synchronisieren
        refresh_topics(client)

    else:
        logging.error(f"Connection to MQTT Broker: {BROKER_ADDRESS} failed (rc={rc})")


def on_disconnect(client, userdata, rc):
    logging.warning(f"Disconnected from broker (rc={rc})")


def create():
    client = mqtt.Client()

    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect

    client.connect(BROKER_ADDRESS, PORT)

    client.loop_start()

    # Hintergrundthread startet die regelmäßige Synchronisierung
    threading.Thread(
        target=topic_watcher,
        args=(client,),
        daemon=True,
    ).start()

    logging.info("MQTT client started")

    return client

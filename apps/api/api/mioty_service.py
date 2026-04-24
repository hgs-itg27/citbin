import logging

import paho.mqtt.client as mqtt
from fastapi import Depends

from dependencies import get_dependencies
from modules import payload_decoder, process_data

TOPIC = "home/tutorial/PubSubDemo"
BROKER_ADDRESS = "localhost"
PORT = 1883


def on_message(client, userdata, message, deps: dict = Depends(get_dependencies)):
    msg = str(message.payload.decode("utf-8"))
    logging.info(f"[DEBUG] Mioty Rohdaten empfangen:\n{msg}")
    decoded = payload_decoder.decode(msg)
    parsed = process_data.parse_sensor_payload(decoded)
    logging.info(f"[DEBUG] Mioty Daten umgewandelt:\n{parsed}")
    process_data.save_sensor_data(deps["db"], parsed)


def on_connect(client, userdata, flags, rc):
    logging.info("Connected to MQTT Broker: " + BROKER_ADDRESS)
    client.subscribe(TOPIC)


def create():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(BROKER_ADDRESS, PORT)
    client.loop_forever()

import logging
import json

import paho.mqtt.client as mqtt

from dependencies import get_dependencies
from modules import payload_decoder, process_data

topics = {"mioty/00-00-00-00-00-00-00-00/fc-a8-4a-01-00-00-36-c8/uplink","mioty/00-00-00-00-00-00-00-00/fc-a8-4a-01-00-00-36-c9/uplink"}
BROKER_ADDRESS = "10.85.33.236"
PORT = 1883


def on_message(client, userdata, message):
    deps = get_dependencies()
    msg = json.loads(message.payload.decode("utf-8"))
    # logging.info(f"[DEBUG] Mioty Rohdaten empfangen:\n{msg}")
    basestations = msg["baseStations"]
    temp = basestations[0]
    temp = temp["snr"]
    logging.info(f'SNR: {temp}')
    decoded = payload_decoder.decode(msg["data"])
    parsed = process_data.parse_sensor_payload(decoded)
    process_data.save_sensor_data(deps["db"], parsed)


def on_connect(client, userdata, flags, rc):
    logging.info("Connected to MQTT Broker: " + BROKER_ADDRESS)
    for t in topics:
        client.subscribe(t)
        logging.info(f"Subscribed succesfully to:{t} ")


def create():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(BROKER_ADDRESS, PORT)
    logging.info("Before loop")
    client.loop_start()
    logging.info("After loop")

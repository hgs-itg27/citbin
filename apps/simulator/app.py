import os
import time
import random
import logging
import json
from datetime import datetime, timezone  # timezone importieren
import base64
import atexit
import paho.mqtt.client as mqtt 


# Konfiguration aus ENV oder Defaults
DEVICE_NAME = os.environ.get("DEVICE_NAME", "Simulator-001")
DEVICE_EUI = os.environ.get("DEVICE_EUI", "Simulator")
SLEEP_TIME = float(os.environ.get("SLEEP_TIME", "5"))
# BACKEND_API_URL = os.environ.get("BACKEND_API_URL", "http://localhost:8000")

# muss noch in die env datei
TOPIC = os.environ.get("TOPIC", "home/tutorial/PubSubDemo")
BROKER_ADDRESS = os.environ.get("BROKER_ADDRESS", "localhost")
PORT = int(os.environ.get("PORT", "1883"))
QOS = int(os.environ.get("QOS", "1"))
client_id = f'python-mqtt-{random.randint(0, 1000)}'


# Logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

# -----------------------------
# MQTT CLIENT (PERSISTENT)
# -----------------------------
client = mqtt.Client(
    mqtt.CallbackAPIVersion.VERSION2,
    client_id
)

try:
    client.connect(BROKER_ADDRESS, PORT)
    client.loop_start()
    logging.info(f"Connected to MQTT Broker: {BROKER_ADDRESS}:{PORT}")
except Exception as e:
    logging.error(f"MQTT connection failed: {e}")


@atexit.register
def cleanup():
    """Clean shutdown"""
    try:
        client.loop_stop()
        client.disconnect()
        logging.info("MQTT client disconnected cleanly")
    except Exception as e:
        logging.error(f"Cleanup error: {e}")


# -----------------------------
# MQTT SEND FUNCTION
# -----------------------------
def send_mqtt_uplink(data):
    try:
        payload = json.dumps(data)

        result = client.publish(TOPIC, payload, qos=QOS)
        result.wait_for_publish()

        logging.info(f"Published to {TOPIC}")

    except Exception as e:
        logging.error(f"MQTT publish error: {e}")


# ----------------------------------------------------------------

while True:
    # Simulierte Messdaten
    distance = round(random.uniform(0, 1750), 1)
    battery = round(random.uniform(2.9, 4.2), 2)
    tilt = random.choice(["ok", "tilt", "none"])

    # Payload als Base64
    raw_payload = json.dumps(
        {"distance": distance, "battery": battery, "tilt": tilt}
    ).encode("utf-8")
    data_base64 = base64.b64encode(raw_payload).decode()

    # Aktuelle Zeit (kompatibel mit älteren Python-Versionen)
    now = datetime.now(timezone.utc).isoformat()

    # Komplette Webhook Message

    mioty_message = {
        "session_key_id": "AYY660iFsk5LInv+xd6AVg==",
        "f_port": 1,
        "f_cnt": 211294,
        "frm_payload": "ESPOFI4Esx0D1gHRAAABZg==",
        "deveui": DEVICE_EUI,
        "time": now,
        "deviceProfileName": "SimulatorProfile",
        "decoded_payload": {
            "alarm": 0,
            "base_id": 1,
            "battery_voltage": 7,
            "tof_status": 0,  # 0 == Valid range
            "tof_distance": 1000,  # in milimeter
            "tof_index": 0,  # Letzter aufgenommer Wert 0 == bis 1.3 m
            "radar_status": 1,  # 1 == erfogreich, 0 == error
            "radar_no_peaks": 3,  # Anzahl der Peaks (unbekannt)
            "radar_distance_1": 1000,  # Distanz 1 mit maximalem Peak in milimeter
            "radar_ra_1": 0,  # Distanz 1 mit maximalem Peak in milimeter
            "radar_distance_2": 1000,  # Distanz 2 mit maximalem Peak in milimeter
            "radar_ra_2": 0,  # Distanz 2 mit maximalem Peak in milimeter
            "radar_distance_3": 1000,  # Distanz 3 mit maximalem Peak in milimeter
            "radar_ra_3": 0,  # Distanz 3 mit maximalem Peak in milimeter
            "acc_status": 0,  # 0 == OK
            "acc_orientation": 2,  # 2 == Linse zum Boden
            "acc_impact": 0,  # 1 == Vandalismusevent
        },
    }

    try:
        send_mqtt_uplink(
            mioty_message
        )  # Use the 'mioty_message' dict
        time.sleep(SLEEP_TIME)

    except Exception as e:
        logging.error(f"Error in main loop during send: {e}")

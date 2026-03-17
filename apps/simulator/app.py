import os
import time
import random
import logging
import json
import uuid
from datetime import datetime, timezone # timezone importieren
import base64
import requests

# Konfiguration aus ENV oder Defaults
DEVICE_NAME = os.environ.get("DEVICE_NAME", "Simulator-001")
DEVICE_EUI = os.environ.get("DEVICE_EUI", "Simulator")
SLEEP_TIME = float(os.environ.get("SLEEP_TIME", "5"))
BACKEND_API_URL = os.environ.get("BACKEND_API_URL", "http://localhost:8000")


# Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


# Funktion zum Senden des Uplinks via HTTP
def send_http_uplink(url, data):
    """Sends the data as JSON via HTTP POST to the specified URL."""
    if not url:
        logging.warning("BACKEND_API_URL is not set. Skipping HTTP uplink.")
        return
    try:
        response = requests.post(url, json=data, timeout=10) # Timeout hinzugefügt
        response.raise_for_status() # Raise an exception for HTTP errors (4xx or 5xx)
        logging.info(f"HTTP uplink successfully sent to {url}. Status: {response.status_code}")
    except requests.exceptions.RequestException as e:
        logging.error(f"Error sending HTTP uplink to {url}: {e}")
    except Exception as e:
        logging.error(f"Unexpected error sending HTTP uplink: {e}")


while True:
    # Simulierte Messdaten
    distance = round(random.uniform(0, 1750), 1)
    battery = round(random.uniform(2.9, 4.2), 2)
    tilt = random.choice(["ok", "tilt", "none"])
    fcnt = random.randint(0, 10000)
    rssi = random.randint(-110, -10)
    snr = round(random.uniform(-20, 15), 1)

    # Payload als Base64
    raw_payload = json.dumps({
        "distance": distance,
        "battery": battery,
        "tilt": tilt
    }).encode("utf-8")
    data_base64 = base64.b64encode(raw_payload).decode()

    # Aktuelle Zeit (kompatibel mit älteren Python-Versionen)
    now = datetime.now(timezone.utc).isoformat()

    # Komplette Webhook Message
    message = {
        "deduplicationId": str(uuid.uuid4()),
        "time": now,
        "deviceInfo": {
            "tenantId": str(uuid.uuid4()),
            "tenantName": "simulator-tenant",
            "applicationId": str(uuid.uuid4()),
            "applicationName": "simulator-app",
            "deviceProfileId": str(uuid.uuid4()),
            "deviceProfileName": "SimulatorProfile",
            "deviceName": DEVICE_NAME,
            "devEui": DEVICE_EUI,
            "deviceClassEnabled": "CLASS_A",
            "tags": {}
        },
        "devAddr": "2601" + format(random.randint(0, 0xFFFF), "04x"),
        "adr": True,
        "dr": 5,
        "fCnt": fcnt,
        "fPort": 85,
        "confirmed": False,
        "data": data_base64,
        "object": {
            "distance": distance,
            "battery": battery,
            "tilt": tilt
        },
        "rxInfo": [
            {
                "gatewayId": "sim-gw-01",
                "uplinkId": random.randint(10000, 99999),
                "gwTime": now,
                "rssi": rssi,
                "snr": snr,
                "crcStatus": "CRC_OK",
                "context": base64.b64encode(os.urandom(6)).decode(),
                "metadata": {
                    "gateway_name": "simulator-gateway",
                    "gateway_id": str(uuid.uuid4()),
                    "regi": "EU868",
                    "gateway_lat": str(round(random.uniform(47, 51), 6)),
                    "gateway_long": str(round(random.uniform(6, 13), 6))
                }
            }
        ],
        "txInfo": {
            "frequency": 867100000,
            "modulation": {
                "lora": {
                    "bandwidth": 125000,
                    "spreadingFactor": 7,
                    "codeRate": "CR_4_5"
                }
            }
        },
        "regionConfigId": "eu868"
    }

    try:
        send_http_uplink(f"{BACKEND_API_URL}/api/v0/helium/uplink", message)  # Use the 'message' dict
        time.sleep(SLEEP_TIME)
    except Exception as e:
        logging.error(f"Error in main loop during send: {e}")
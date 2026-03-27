# Device Simulator

This script simulates a LoRaWAN and a Mioty device sending uplink messages with sensor data. It can send these messages either via HTTP POST to a backend endpoint, or both.

## Installation

The simulator requires Python 3 and the libraries listed in `requirements.txt`.

Install the dependencies using pip:

```bash
pip install -r requirements.txt
```

## Running the Simulator

You can run the simulator directly using Python:

```bash
python app.py
```

The simulator's behavior can be configured using environment variables.

## Configuration

The following environment variables can be used to configure the simulator:

| Variable                | Description                                                                 | Default Value                       |
| ----------------------- | --------------------------------------------------------------------------- | ----------------------------------- |
| `DEVICE_NAME`           | Name of the simulated device.                                               | `Simulator-001`                     |
| `DEVICE_EUI`            | LoRaWAN Device EUI (DevEUI). If not set, a random one is generated.         | `eui-<random_hex>`                  |
| `SLEEP_TIME`            | Time in seconds between sending messages.                                   | `5`                                 |
| `BACKEND_API_URL`       | Base URL of the backend API for HTTP uplinks.                               | `http://localhost:8000`             |


If an invalid value is provided, a warning will be logged, and no messages will be sent.

## Message Format

The simulator generates messages mimicking the Helium webhook format, including simulated sensor data (distance, battery, tilt) within the `object` and base64 encoded in the `data` field.

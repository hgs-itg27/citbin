import json
from typing import Any
import logging

def uncomplement(val, bitwidth):
    isnegative = val & (1 << (bitwidth - 1))
    boundary = (1 << bitwidth)
    minval = -boundary
    mask = boundary - 1
    return minval + (val & mask) if isnegative else val


def decoder(bytes_data, port):
    decoded = {}

    if port == 1:
        # Attributes
        decoded["base_id"] = bytes_data[0] >> 4
        decoded["major_version"] = bytes_data[0] & 0x0F
        decoded["minor_version"] = bytes_data[1] >> 4
        decoded["product_version"] = bytes_data[1] & 0x0F

        # Telemetry
        decoded["up_cnt"] = bytes_data[2]
        decoded["battery_voltage"] = ((bytes_data[3] << 8) | bytes_data[4]) / 1000.0
        decoded["internal_temperature"] = bytes_data[5] - 128
        decoded["alarm"] = "ALARM" if bytes_data[6] else "NO ALARM"
        decoded["master_value"] = ((bytes_data[7] << 8) | bytes_data[8])

        byte_cnt = 9

        # ToF
        if bytes_data[1] & 0x01:
            decoded["tof_status"] = bytes_data[byte_cnt]; byte_cnt += 1
            decoded["tof_distance"] = ((bytes_data[byte_cnt] << 8) | bytes_data[byte_cnt+1]); byte_cnt += 2
            decoded["tof_index"] = bytes_data[byte_cnt]; byte_cnt += 1

        # Radar
        if bytes_data[1] & 0x02:
            decoded["radar_status"] = bytes_data[byte_cnt]; byte_cnt += 1
            decoded["radar_no_peaks"] = bytes_data[byte_cnt]; byte_cnt += 1

            decoded["radar_distance_1"] = ((bytes_data[byte_cnt] << 8) | bytes_data[byte_cnt+1]); byte_cnt += 2
            decoded["radar_amplitude_1"] = uncomplement(
                (bytes_data[byte_cnt] << 8) | bytes_data[byte_cnt+1], 16
            ); byte_cnt += 2

            decoded["radar_distance_2"] = ((bytes_data[byte_cnt] << 8) | bytes_data[byte_cnt+1]); byte_cnt += 2
            decoded["radar_amplitude_2"] = uncomplement(
                (bytes_data[byte_cnt] << 8) | bytes_data[byte_cnt+1], 16
            ); byte_cnt += 2

            decoded["radar_distance_3"] = ((bytes_data[byte_cnt] << 8) | bytes_data[byte_cnt+1]); byte_cnt += 2
            decoded["radar_amplitude_3"] = uncomplement(
                (bytes_data[byte_cnt] << 8) | bytes_data[byte_cnt+1], 16
            ); byte_cnt += 2

        # ACC
        if bytes_data[1] & 0x04:
            decoded["acc_status"] = "Fehler" if bytes_data[byte_cnt] else "OK"; byte_cnt += 1
            decoded["acc_orientation"] = bytes_data[byte_cnt]; byte_cnt += 1
            decoded["acc_open"] = bytes_data[byte_cnt]; byte_cnt += 1
            decoded["acc_open_cnt"] = ((bytes_data[byte_cnt] << 8) | bytes_data[byte_cnt+1]); byte_cnt += 2
            decoded["acc_impact"] = "Vandalismus" if bytes_data[byte_cnt] else "OK"; byte_cnt += 1

        # Hall
        if bytes_data[1] & 0x08:
            decoded["hall_open"] = bytes_data[byte_cnt]; byte_cnt += 1
            decoded["hall_open_cnt"] = ((bytes_data[byte_cnt] << 8) | bytes_data[byte_cnt+1]); byte_cnt += 2

    else:
        decoded["info"] = f"Port {port} wird aktuell nicht unterstützt"

    return decoded


def hex_to_bytes(hex_string):
    hex_string = hex_string.lower().replace("0x", "").replace(" ", "")
    return list(bytes.fromhex(hex_string))

def decode(encoded_payload:str)->dict[str,Any]:
    hex_input = encoded_payload
    port = 1
        try:
            bytes_data = hex_to_bytes(hex_input)

            logging.info("\nRohbytes:")
            logging.info(bytes_data)

            result = decoder(bytes_data, port)

            logging.info("\nDecoded Payload:")
            logging.info(json.dumps(result, indent=2))
            return result

    except Exception as e:
        logging.info("Fehler:", e)
    
        

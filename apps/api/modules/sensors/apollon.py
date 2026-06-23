from typing import Dict, Any
from modules.sensors.base import Sensor
import logging


class Apollon_Q(Sensor):
    profile_name = "APOLLON-Q"

    @staticmethod
    def get_data(object: Dict[str, Any]) -> Dict[str, Any]:
        battery, distance = object.get("battery_voltage"), object.get("master_value")
        return {"battery": battery, "distance": distance}

    @staticmethod
    def process_data(data: Dict[str, Any], trashbin_profile) -> Dict[str, Any]:
        temp = data.get("battery")
        logging.info(f"Battery: {temp}")
        MAX_BAT = 6.1
        MIN_BAT = 5.7
        battery = 0
        fill_level = None

        if temp is not None:
            battery = int((temp - MIN_BAT) / (MAX_BAT - MIN_BAT) * 100)
        if data.get("distance") is not None:
            fill_level = trashbin_profile.calc_level_by_distance(data.get("distance"))
            if fill_level < 0:
                fill_level = 0

        if battery is None:
            battery = 0
        if battery > 100:
            battery = 100

        logging.info(f"Battery: {battery}")
        return {
            "battery": battery,
            "distance": data.get("distance"),
            "fill_level": fill_level,
        }

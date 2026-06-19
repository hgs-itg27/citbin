from typing import Dict, Any
from modules.sensors.base import Sensor


class Apollon_Q(Sensor):
    profile_name = "APOLLON-Q"

    @staticmethod
    def get_data(object: Dict[str, Any]) -> Dict[str, Any]:
        battery, distance = object.get("battery_voltage"), object.get(
            "radar_distance_1"
        )
        return {"battery": battery, "distance": distance}

    @staticmethod
    def process_data(data: Dict[str, Any], trashbin_profile) -> Dict[str, Any]:
        MAX_BAT = 6.2
        MIN_BAT = 5.7
        battery = None
        fill_level = None

        if data.get("battery") is not None:
            battery = int((data.get("battery") - MIN_BAT) / (MAX_BAT - MIN_BAT) * 100)
        if data.get("distance") is not None:
            fill_level = trashbin_profile.calc_level_by_distance(data.get("distance"))
            if fill_level < 0:
                fill_level = 0

        return {
            "battery": battery,
            "distance": data.get("distance"),
            "fill_level": fill_level,
        }

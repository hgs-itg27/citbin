from typing import Dict, Any
from modules.sensors.base import Sensor

class EM400_TLD(Sensor):
    profile_name = 'MIL-EM400-TLD'

    @staticmethod
    def get_data(object: Dict[str, Any]) -> Dict[str, Any]:
        battery, distance = object.get('battery'), object.get('distance')
        return {
            'battery': battery,
            'distance': distance
        }
    
    @staticmethod
    def process_data(data: Dict[str, Any], trashbin_profile) -> Dict[str, Any]:
        battery = None
        fill_level = None

        if data.get('battery') is not None:
            battery = data.get('battery')
        if data.get('distance') is not None:
            fill_level = trashbin_profile.calc_level_by_distance(data.get('distance'))
            if fill_level < 0:
                fill_level = 0

        return {
            'battery': battery,
            'distance': data.get('distance'),
            'fill_level': fill_level
        }

class EM310_UDL(Sensor):
    profile_name = 'MIL-EM310-UDL'

    @staticmethod
    def get_data(object: Dict[str, Any]) -> Dict[str, Any]:
        battery, distance = object.get('battery'), object.get('distance')
        return {
            'battery': battery,
            'distance': distance
        }
    
    @staticmethod
    def process_data(data: Dict[str, Any], trashbin_profile) -> Dict[str, Any]:
        battery = None
        fill_level = None

        if data.get('battery') is not None:
            battery = data.get('battery')
        if data.get('distance') is not None:
            fill_level = trashbin_profile.calc_level_by_distance(data.get('distance'))
            if fill_level < 0:
                fill_level = 0

        return {
            'battery': battery,
            'distance': data.get('distance'),
            'fill_level': fill_level
        }

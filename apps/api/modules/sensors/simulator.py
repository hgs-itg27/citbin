from typing import Dict, Any
from modules.sensors.base import Sensor

class Simulator(Sensor):
    """
    Simulator-Sensor für Testdaten.
    Verwendet spezifische Batteriebereiche für die Berechnung.
    """

    profile_name = 'SimulatorProfile'

    @staticmethod
    def get_data(object: Dict[str, Any]) -> Dict[str, Any]:
        battery, distance = object.get('battery'), object.get('distance')
        return {
            'battery': battery,
            'distance': distance
        }
    
    @staticmethod
    def process_data(data: Dict[str, Any], trashbin_profile) -> Dict[str, Any]:
        MAX_BAT = 4.2
        MIN_BAT = 2.9
        battery = None
        fill_level = None

        if data.get('battery') is not None:
            battery = int((data.get('battery') - MIN_BAT) / (MAX_BAT - MIN_BAT) * 100)
        if data.get('distance') is not None:
            fill_level = trashbin_profile.calc_level_by_distance(data.get('distance'))
            if fill_level < 0:
                fill_level = 0

        return {
            'battery': battery,
            'distance': data.get('distance'),
            'fill_level': fill_level
        }

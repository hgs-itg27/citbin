from typing import Dict, Any
from modules.trashbins.base import Trashbin


class Sensor:
    """
    Basisklasse für alle Sensoren.
    Jeder Sensor muss die Methoden get_data und process_data implementieren.
    """

    profile_name = None

    @staticmethod
    def get_data(object: Dict[str, Any]) -> Dict[str, Any]:
        """
        Returns raw battery and distance values from mioty payloads 'object'

        Args:
            object: mioty payloads 'object' attribute as Dict

        Returns:
            Dictionary with raw values
            -battery
            -distance
        """
        ...

    @staticmethod
    def process_data(data: Dict[str, Any], trashbin_profile: Trashbin) -> Dict[str, Any]:
        """
        Sensor specific processing of raw data (from get_data method)

        Args:
            data: data from get_data method

        Returns:
            Dictionary with processed values
            -battery (int, [0; 100])
            -distance (int, [0; infinite[)
            -fill_level (int, [0; 100])
        """
        ...

import importlib
import inspect
import pkgutil
import logging
from typing import Dict, Type
from modules.sensors.base import Sensor


class SensorFactory:
    """
    Factory für Sensor-Klassen, die automatisch Sensor-Implementierungen lädt
    und registriert.
    """
    _sensors: Dict[str, Type[Sensor]] = {}
    _initialized = False

    @classmethod
    def initialize(cls, sensors_package_path: str = "modules.sensors") -> None:
        """
        Initialisiert die Factory und lädt alle verfügbaren Sensor-Klassen aus
        dem sensors-Paket.

        Args:
            sensors_package_path: Pfad zum Paket, das die Sensor-Klassen
            enthält
        """
        if cls._initialized:
            return

        # Importiere das Sensor-Basispaket
        sensors_package = importlib.import_module(sensors_package_path)

        # Finde alle Module im sensors-Paket
        for _, module_name, is_pkg in pkgutil.iter_modules(
            sensors_package.__path__,
            f"{sensors_package_path}."
        ):
            if not is_pkg:  # Nur Module, keine Unterpakete
                try:
                    # Importiere das Modul
                    module = importlib.import_module(module_name)

                    # Finde alle Klassen im Modul, die von Sensor erben
                    for name, obj in inspect.getmembers(module):
                        if (inspect.isclass(obj) and issubclass(obj, Sensor) and obj != Sensor):
                            # Registriere die Sensor-Klasse
                            cls.register_sensor(obj.profile_name, obj)
                            logging.info(f"Sensor-Klasse registriert: {name} aus {module_name} mit Profilnamen {obj.profile_name}")
                except Exception as e:
                    logging.error(f"Fehler beim Laden des Sensor-Moduls {module_name}: {e}")

        cls._initialized = True
        logging.info(f"SensorFactory initialisiert mit {len(cls._sensors)} Sensor-Typen")

    @classmethod
    def register_sensor(cls, name: str, sensor_class: Type[Sensor]) -> None:
        """
        Registriert eine Sensor-Klasse in der Factory.
        Args:
            name: Name des Sensors
            sensor_class: Sensor-Klasse
        """
        cls._sensors[name] = sensor_class

    @classmethod
    def get_sensor(cls, profile_name: str) -> Type[Sensor]:
        """
        Gibt eine Sensor-Klasse basierend auf dem Profilnamen zurück.
        Wenn kein passender Sensor gefunden wird, wird der Generic-Sensor zurückgegeben.

        Args:
            profile_name: Name des Sensor-Profils

        Returns:
            Sensor-Klasse
        """
        if not cls._initialized:
            cls.initialize()

        return cls._sensors.get(profile_name, cls._sensors.get('Generic'))

    @classmethod
    def get_all_sensors(cls) -> Dict[str, Type[Sensor]]:
        """
        Gibt alle registrierten Sensor-Klassen zurück.

        Returns:
            Dictionary mit allen registrierten Sensor-Klassen
        """
        if not cls._initialized:
            cls.initialize()

        return cls._sensors

import importlib
import inspect
import pkgutil
import logging
from typing import Dict, Type
from modules.trashbins.base import Trashbin


class TrashbinFactory:
    """
    Factory für Trashbin-Klassen, die automatisch Trashbin-Implementierungen lädt
    und registriert.
    """
    _trashbins: Dict[str, Type[Trashbin]] = {}
    _initialized = False

    @classmethod
    def initialize(cls, trashbins_package_path: str = "modules.trashbins") -> None:
        """
        Initialisiert die Factory und lädt alle verfügbaren Trashbin-Klassen aus dem trashbins-Paket.

        Args:
            trashbins_package_path: Pfad zum Paket, das die Trashbin-Klassen enthält
        """
        if cls._initialized:
            return

        # Importiere das Trashbin-Basispaket
        package = importlib.import_module(trashbins_package_path)

        # Finde alle Module im trashbins-Paket
        for _, module_name, is_pkg in pkgutil.iter_modules(package.__path__, f"{trashbins_package_path}."):
            if not is_pkg:  # Nur Module, keine Unterpakete
                try:
                    # Importiere das Modul
                    module = importlib.import_module(module_name)

                    # Finde alle Klassen im Modul, die von Trashbin erben
                    for name, obj in inspect.getmembers(module):
                        if (inspect.isclass(obj) and issubclass(obj, Trashbin) and obj != Trashbin):
                            # Registriere die Trashbin-Klasse
                            cls.register_trashbin(obj.profile_name, obj)
                            logging.debug("Trashbin-Klasse registriert: %s aus %s", name, module_name)
                except Exception as e:
                    logging.error("Fehler beim Laden des Trashbin-Moduls %s: %s", module_name, e)

        cls._initialized = True
        logging.debug("TrashbinFactory initialisiert mit %d Trashbin-Typen", len(cls._trashbins))

    @classmethod
    def register_trashbin(cls, name: str, trashbin_class: Type[Trashbin]) -> None:
        """
        Registriert eine Trashbin-Klasse in der Factory.
        Args:
            name: Name des Trashbins
            trashbin_class: Trashbin-Klasse
        """
        cls._trashbins[name] = trashbin_class

    @classmethod
    def get_trashbin(cls, profile_name: str) -> Type[Trashbin]:
        """
        Gibt eine Trashbin-Klasse basierend auf dem Profilnamen zurück.
        Wenn kein passender Trashbin gefunden wird, wird der Generic-Trashbin zurückgegeben.

        Args:
            profile_name: Name des Trashbin-Profils

        Returns:
            Trashbin-Klasse
        """
        if not cls._initialized:
            cls.initialize()

        return cls._trashbins.get(profile_name)

    @classmethod
    def get_all_trashbins(cls) -> Dict[str, Type[Trashbin]]:
        """
        Gibt alle registrierten Trashbin-Klassen zurück.

        Returns:
            Dictionary mit allen registrierten Trashbin-Klassen
        """
        if not cls._initialized:
            cls.initialize()

        return cls._trashbins

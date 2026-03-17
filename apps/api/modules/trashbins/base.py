class Trashbin:
    """
    Basisklasse für alle Mülleimer
    Jeder Mülleimer muss die Methode calc_level_by_distance implementieren
    """

    profile_name = None

    @staticmethod
    def calc_level_by_distance(distance: float | int):
        ...
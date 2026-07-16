from modules.trashbins.base import Trashbin


class Unteflur(Trashbin):
    profile_name = "Unterflur"

    @staticmethod
    def calc_level_by_distance(distance):

        if distance < 800:
            kragen_level = (800 - distance) / 800 * 100
        else:
            kragen_level = 0

        return int(kragen_level)


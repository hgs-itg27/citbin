from modules.trashbins.base import Trashbin


class Unteflur(Trashbin):

    profile_name = "Unterflur"

    @staticmethod
    def calc_level_by_distance(distance):

        if distance < 1000:
            kragen_level = (1000 - distance) / 1000 * 100
        else:
            kragen_level = 0

        # Rechnung nach Tankvolumen von ~800L und Kragenvolumen von ~200L
        fill_level = int(kragen_level)

        return fill_level

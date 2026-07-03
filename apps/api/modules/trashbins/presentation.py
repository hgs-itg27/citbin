from modules.trashbins.base import Trashbin


class Demo(Trashbin):

    profile_name = "Demo"

    @staticmethod
    def calc_level_by_distance(distance):
        fill_level = (1000 - distance) / 1000 * 100

        return fill_level

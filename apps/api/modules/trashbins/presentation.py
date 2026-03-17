from modules.trashbins.base import Trashbin

class Demo(Trashbin):

    profile_name = 'Demo'

    @staticmethod
    def calc_level_by_distance(distance):
        fill_level = (1750 - distance) / 1750 * 100

        return fill_level

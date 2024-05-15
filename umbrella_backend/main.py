from Gereate.GereateManager import GereateManager
class main:
    Devices = []
    Connected_Devices = GereateManager.getAngeschlosseneGereate()
    print(Connected_Devices)
    @staticmethod
    def contains(ip):
        for g in main.Devices:
            if g.get_ip() == ip:
                return True
        return False 
    
    @staticmethod
    def get_device(ip):
        for g in main.Devices:
            if g.get_ip() == ip:
                return g
        return None 


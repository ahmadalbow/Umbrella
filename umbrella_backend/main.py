from Gereate.GereateManager import GereateManager
from Gereate.HMP4040 import HMP4040

class main:
    Devices = []
    #Connected_Devices = GereateManager.getAngeschlosseneGereate()
    Connected_Devices = []
    for p in Connected_Devices:
        if (p[2] == "Rohde & Schwarz"):
            try:
                        # Create an HMP4040 device instance and add it to the 'main.Devices' list.
                hmp4040 = HMP4040(p[1])
                Devices.append(hmp4040)
                            
            except Exception as e:
                pass
                
                        
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
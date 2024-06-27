import pandas as pd  # Correct import statement for pandas
from pages import models
import numpy as np
class DptFileToGraph():
    def __init__(self, file ):
        self.file = file
        self.dataframes = self.get_dataframes_from_dpt_file()
        self.merged_data = pd.concat([self.dataframes[0]] + [df.iloc[:, 1:] for df in self.dataframes[1:]], axis=1)
        self.verrechne_mit_Uebertragungsfunktion()
        self.planck_spinbox(500, 1.05)

    def get_dataframes_from_dpt_file(self):
        dataframes = []
        file = self.file
        try:
            # Read the file into a DataFrame
            df = pd.read_csv(file, delim_whitespace=True, header=None, names=['wavelength', 'amplitude'])

            # Append the DataFrame to the list
            dataframes.append(df)
            
        except Exception as e:
            print(f"Error reading the file: {e}")
        
        return dataframes

    def verrechne_mit_Uebertragungsfunktion(self):
        import numpy as np
        # Read the file "Uebertragungsfunktion_FTIR.txt"
        self.Ubertragungsfunktion_df = pd.read_csv("core/Uebertragungsfunktion_FTIR.txt", sep="\t")
        
        # Reverse dataframe so wavenumber is ascending
        self.merged_data.iloc[:] = self.merged_data.iloc[::-1]
        self.Ubertragungsfunktion_df.iloc[:] = self.Ubertragungsfunktion_df.iloc[::-1]

        # Interpolate the Übertragungsfunktion for each wavenumber in "merged_data"
        self.Ubertragungsfunktion_df_interpoliert = pd.DataFrame()
        self.Ubertragungsfunktion_df_interpoliert['wavelength'] = self.merged_data['wavelength']
        self.Ubertragungsfunktion_df_interpoliert['interpolated_value'] = np.interp(
            self.merged_data['wavelength'],
            self.Ubertragungsfunktion_df.iloc[:, 0],
            self.Ubertragungsfunktion_df.iloc[:, 2]
        )

        # Multiply column 1 of Übertragungsfunktion with each column of merged_data from column 2 onwards
        for col in self.merged_data.columns[1:]:
            self.merged_data[col] = self.merged_data[col] / self.Ubertragungsfunktion_df_interpoliert['interpolated_value']
    
        # Delete last row due to interpolation error
        self.merged_data.drop(self.merged_data.index[-1], inplace=True)
        
        # Sort for wavelength
        self.merged_data.sort_values(by='wavelength', ascending=False, inplace=True)

        # Change to wavelength and normalize
        self.merged_data['wavelength'] = 10000 / self.merged_data['wavelength']  # Wellenzahl in Wellenlaenge
        for col in self.merged_data.columns[1:]:
            self.merged_data[col] = self.merged_data[col] / self.merged_data[col].iloc[2000:2900].max()


    def planck_spinbox(self, temp, scale):

        # Erstellen Sie eine neue Planck-Kurve
        self.temperature = temp + 273.15
        self.scale = scale
        
        self.wavelength = np.arange(0.1, 20.1, 0.1)
              
        self.intensity = [self.planck_radiation(w, self.temperature, self.scale) for w in self.wavelength]


        return [self.intensity, self.wavelength]
    
    def getwavelength(self):
        return  self.wavelength.tolist() 
    
    def getIntensity(self):
        return self.intensity 
    
    def planck_radiation(self, t, T, Skalierung):
        # Berechnen Sie die normierte spektrale spezifische Ausstrahlung gemäß dem Planckschen Strahlungsgesetz
        return 2.90805156249832e+19/(T**5*t**5*(np.exp(14387.7695998382/(T*t)) - 1.0)) * Skalierung
    
    def getName(self):
        return f"{int(self.temperature - 273.15)} °C, max@{round(2898/self.temperature, 2)} um"
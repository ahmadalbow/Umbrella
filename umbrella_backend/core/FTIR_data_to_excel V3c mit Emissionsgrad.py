# -*- coding: utf-8 -*-
"""
Created on Thu Feb  1 11:51:50 2024

@author: i40010969
"""

import tkinter as tk
import tkinter.filedialog
from tkinter import messagebox, ttk
import pandas as pd
import os
import re
import csv
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg, NavigationToolbar2Tk
import numpy as np
import mplcursors

class FileMergerGUI:
    def __init__(self, master):
        self.master = master
        master.title("File Merger")

        self.file_names_text = tk.Text(master, height=3, width=150)
        self.file_names_text.pack()

        self.merged_data_text = tk.Text(master, height=3, width=150)
        self.merged_data_text.pack()


        self.copy_button = tk.Button(master, text="Copy table to clipboard", command=self.copy_to_clipboard)
        self.copy_button.pack()
        
        self.save_button = tk.Button(master, text="Save plot(s) as png", command=self.save_plot_to_file)
        self.save_button.pack()

        self.save_button = tk.Button(master, text="Save plot(s) as csv", command=self.save_selected_curve_to_csv_file)
        self.save_button.pack()

        self.save_button = tk.Button(master, text="Save emissivity plot(s) as csv", command=self.save_selected_emissivity_to_csv_file)
        self.save_button.pack()
    
        self.checkbox_autosave_plots_status = tk.BooleanVar()
        self.checkbox = tk.Checkbutton(master, text="Autosave plots on combobox change", variable=self.checkbox_autosave_plots_status, command=self.checkbox_autosave_plots)
        self.checkbox.pack()
        
        self.checkbox_plot_emissivity_status = tk.BooleanVar()
        self.checkbox = tk.Checkbutton(master, text="Plot emissivity", variable=self.checkbox_plot_emissivity_status, command=self.checkbox_plot_emissivity)
        self.checkbox.pack()        
        self.checkbox_plot_emissivity_status.set(False)
        
        self.checkbox_plot_smoothed_emissivity_status = tk.BooleanVar()
        self.checkbox = tk.Checkbutton(master, text="Plot smoothed emissivity", variable=self.checkbox_plot_smoothed_emissivity_status, command=self.checkbox_plot_smoothed_emissivity)
        # self.checkbox.pack()        
        self.checkbox_plot_smoothed_emissivity_status.set(False)
        
        # Create a Spinbox
        self.spin_box = tk.Spinbox(master, from_=0, to=2000, increment=5, command=self.planck_spinbox)
        self.spin_box.pack()
        self.spin_box.delete( 0, "end" )
        self.spin_box.insert( 0, '500' )  

        # Create a Spinbox
        self.spin_box_scale = tk.Spinbox(master, from_=.5, to=1.5, increment=.01, command=self.planck_spinbox)
        self.spin_box_scale.pack()
        self.spin_box_scale.delete( 0, "end" )
        self.spin_box_scale.insert( 0, '1.05' )          
        
        # Create the dropdown menu
        self.dropdown_menu = ttk.Combobox(master, values=[])
        self.dropdown_menu.pack()
        self.dropdown_menu.bind("<<ComboboxSelected>>", self.on_dropdown_selection)
        self.dropdown_menu.bind("<Down>", self.on_down_arrow)

        # Create the dropdown menu
        self.dropdown_smooth_menu = ttk.Combobox(master, values=[10, 20, 50, 100, 200, 500, 1000, 10000, 100000, 1000000, 10000000])
        #self.dropdown_smooth_menu.pack()
        self.dropdown_smooth_menu.bind("<<ComboboxSelected>>", self.on_dropdown_smooth_selection)
        self.dropdown_smooth_menu.current(0) # select first entry
        self.lmbda = float(self.dropdown_smooth_menu.get())
        
        # Create a Figure and Axes for the plot
        #self.fig, self.ax = plt.subplots(figsize=(20, 15))
        self.fig, self.ax = plt.subplots(figsize=(20, 10))
        self.canvas = FigureCanvasTkAgg(self.fig, master=master)
        self.canvas.get_tk_widget().pack()   


        self.toolbar = NavigationToolbar2Tk(self.canvas, master)
        self.toolbar.update()
        self.canvas.get_tk_widget().pack()
    
  
        self.file_names = []
        self.data_frames = []

        self.load_folder()

    def load_folder(self):
        self.folder_path = tkinter.filedialog.askdirectory(initialdir=r"C:\Users\i40010969\Endress+Hauser\Infrasolid GmbH - Documents\07_Produktion\13_Prozessdaten\100_Warenausgangsprüfung")
        if self.folder_path:
            for root, dirs, files in os.walk(self.folder_path):
                for filename in files:
                    if filename.endswith(".dpt"):
                        self.file_names.append(os.path.join(root, filename))
                        
        print(f"Found {len(self.file_names)} .dpt files.")
        
        if bool(self.file_names):
            self.Programmablauf()



    def display_file_names(self):
        self.file_names_text.delete('1.0', tk.END)
        for i, fn in enumerate(self.file_names):
            self.file_names_text.insert(tk.END, f"File {i+1}: {os.path.basename(fn)}\n")        

            
    def Programmablauf(self):
        ''' Prgrammablauf '''
        #self.display_file_names()
        self.merge_files()
        #self.populate_dropdown_menu()
        #self.display_merged_data()
        self.plot_merged_data()
        self.planck_spinbox()
        # self.calculate_emissivity()
        # self.plot_emissivity()
        # self.checkbox_autosave_plots_status = False


    def populate_dropdown_menu(self):
        """Populate the dropdown menu with column names from the merged data."""
        name_lines = self.merged_data.columns.tolist()[1:]  # Get column names starting from the second column
        
        pattern = r"_([A-Z]{2}\d{4})"
        # pattern = r"_\d{5}"
        result_list = []
        
        try:
            for s in name_lines:
                match = re.search(pattern, s)
                if match:
                    result_list.append(match[0][1:]) # remove first letter = "_"
        except:
            print("Name pattern not matched")
        
        if not result_list: # list is empty
            result_list = name_lines
        
        # remove dupllicates
        result_list = sorted(list(set(result_list)))
        
        self.dropdown_menu["values"] = ["Alle"] + result_list
        self.dropdown_menu.current(0) # select first entry
        self.selected_column = self.dropdown_menu.get()

    def on_dropdown_selection(self, event):
        """Handle the selection of an item from the dropdown menu."""
        self.selected_column = self.dropdown_menu.get()
        self.plot_merged_data()
        self.plot_planck()
        self.checkbox_plot_emissivity()
        self.checkbox_plot_smoothed_emissivity()
        if self.checkbox_autosave_plots_status.get():
            self.fast_save(self.selected_column)

    def on_down_arrow(self, event):
        # Generate a MouseWheel event with a negative delta to emulate scrolling down
        self.dropdown_menu.event_generate("<MouseWheel>", delta=-120)


    def on_dropdown_smooth_selection(self, event):
        """Handle the selection of an item from the dropdown smooth menu."""
        self.lmbda = self.dropdown_smooth_menu.get()
        if self.checkbox_plot_emissivity_status.get():
            #print("Checkbox emissivity is checked")
            self.plot_smoothed_emissivity()
        else:
            #print("Checkbox emissivity is unchecked") 
            self.unplot_smoothed_emissivity()

        


    def checkbox_autosave_plots(self):
        if self.checkbox_autosave_plots_status.get():
            print("Checkbox is checked")
        else:
            print("Checkbox is unchecked")
        # print(f"Checkbox status: {self.checkbox_autosave_plots_status.get()}")

    def unplot_smoothed_emissivity(self):
        # Löschen der vorhandenen Emissionsgrad-Kurven
        try: 
            # print(self.emissivity_lines)
            for line in self.smoothed_emissivity_lines:
                self.ax.lines.remove(line)
        except:
            print("cannot remove smoothed emissivity line")
            pass 

        self.canvas.draw()
                
    def plot_smoothed_emissivity(self):
        if self.checkbox_plot_smoothed_emissivity_status.get():
            # Löschen der vorhandenen Emissionsgrad-Kurven
            try: 
                # print(self.emissivity_lines)
                for line in self.smoothed_emissivity_lines:
                    self.ax.lines.remove(line)
                self.smoothed_emissivity_lines = []
            except:
                print("cannot remove smoothed emissivity line")
                pass  
    
            self.calculate_emissivity()
            self.calculate_smoothed_emissivity()
            
            if self.selected_column == "Alle":
                columns_to_plot = self.merged_data.columns.tolist()[1:]
            else:
                columns_to_plot = self.find_strings_with_substring(self.merged_data.columns.tolist()[1:], self.selected_column)
                
            for column in columns_to_plot:
                # Plot the selected column
                line, = self.ax.plot(self.smoothed_emissivity.iloc[:, 0], self.smoothed_emissivity[column], label="Emissionsgrad " + column)     
                self.smoothed_emissivity_lines.append(line) 
                
            '''
            for col in self.emissivity.columns[1:]:
                line, = self.ax.plot(self.emissivity.iloc[:, 0], self.emissivity[col])
                self.emissivity_lines.append(line)    
            '''
            self.canvas.draw()

    def checkbox_plot_emissivity(self):
        if self.checkbox_plot_emissivity_status.get():
            #print("Checkbox emissivity is checked")
            self.plot_emissivity()
        else:
            #print("Checkbox emissivity is unchecked") 
            self.unplot_emissivity()
            
    def checkbox_plot_smoothed_emissivity(self):
        if self.checkbox_plot_smoothed_emissivity_status.get():
            #print("Checkbox emissivity is checked")
            self.plot_smoothed_emissivity()
        else:
            #print("Checkbox emissivity is unchecked") 
            self.unplot_smoothed_emissivity()


    def unplot_emissivity(self):
        # Löschen der vorhandenen Emissionsgrad-Kurven
        try: 
            # print(self.emissivity_lines)
            for line in self.emissivity_lines:
                self.ax.lines.remove(line)
        except:
            print("cannot remove emissivity line")
            pass 

        self.canvas.draw()
                
    def plot_emissivity(self):
        if self.checkbox_plot_emissivity_status.get():
            # Löschen der vorhandenen Emissionsgrad-Kurven
            try: 
                # print(self.emissivity_lines)
                for line in self.emissivity_lines:
                    self.ax.lines.remove(line)
            except:
                print("cannot remove emissivity line")
                pass  
    
            self.calculate_emissivity()
            
            if self.selected_column == "Alle":
                columns_to_plot = self.merged_data.columns.tolist()[1:]
            else:
                columns_to_plot = self.find_strings_with_substring(self.merged_data.columns.tolist()[1:], self.selected_column)
                
            for column in columns_to_plot:
                # Plot the selected column
                line, = self.ax.plot(self.emissivity.iloc[:, 0], self.emissivity[column], label="Emissionsgrad " + column)     
                self.emissivity_lines.append(line) 
                
            '''
            for col in self.emissivity.columns[1:]:
                line, = self.ax.plot(self.emissivity.iloc[:, 0], self.emissivity[col])
                self.emissivity_lines.append(line)    
            '''
            self.canvas.draw()

    def calculate_emissivity(self):
        
        #self.emissivity.iloc[0:0] # drop all data
        self.emissivity = self.merged_data.copy()
        
        
        self.emissivity_lines = []
        
        '''
        for col in self.emissivity.columns[1:]:
            self.emissivity[col] = self.merged_data[col] / self.planck_radiation(self.emissivity.iloc[:, 0], self.temperature, self.scale)
            self.emissivity_lines.append(self.ax.plot(self.emissivity.iloc[:, 0], self.emissivity[col]))
        '''
        
        for col in self.emissivity.columns[1:]:
            self.emissivity[col] = self.merged_data[col] / self.planck_radiation(self.emissivity.iloc[:, 0], self.temperature, self.scale)


    def calculate_smoothed_emissivity(self):
        from whittaker_eilers import WhittakerSmoother

     
        #self.emissivity.iloc[0:0] # drop all data
        self.smoothed_emissivity = self.merged_data.copy()
        
        
        self.smoothed_emissivity_lines = []
        
        '''
        for col in self.emissivity.columns[1:]:
            self.emissivity[col] = self.merged_data[col] / self.planck_radiation(self.emissivity.iloc[:, 0], self.temperature, self.scale)
            self.emissivity_lines.append(self.ax.plot(self.emissivity.iloc[:, 0], self.emissivity[col]))
        '''

        for col in self.smoothed_emissivity.columns[1:]:
            #apply smoothing
            
            y = self.merged_data[col] / self.planck_radiation(self.emissivity.iloc[:, 0], self.temperature, self.scale)
            whittaker_smoother = WhittakerSmoother(lmbda=float(self.lmbda), order=2, data_length=len(y))
            
            self.smoothed_emissivity[col] = whittaker_smoother.smooth(y)


    def planck_spinbox(self):

        # Erstellen Sie eine neue Planck-Kurve
        self.temperature = float(self.spin_box.get()) + 273.15
        self.scale = float(self.spin_box_scale.get())
        
        self.wavelength = np.arange(0.1, 20.1, 0.1)
              
        self.intensity = [self.planck_radiation(w, self.temperature, self.scale) for w in self.wavelength]
        
        self.plot_planck()
        
        self.checkbox_plot_emissivity()
        self.checkbox_plot_smoothed_emissivity()
        
        
    def plot_planck(self):

        # Löschen Sie die vorhandene Planck-Kurve
        try: 
            self.ax.lines.remove(self.planck_line)
        except:
            pass
        
        # Zeichnen Sie die Planck-Kurve
        self.planck_line, = self.ax.plot(self.wavelength, self.intensity, color = 'black', label = f"{int(self.temperature - 273.15)} °C, max@{round(2898/self.temperature, 2)} um")
        #self.ax.legend(self.ax.get_legend_handles_labels()[0] + [mpatches.Rectangle((0, 0), 0, 0, alpha=0)], self.ax.get_legend_handles_labels()[1] + ["%.0f °C"%(temperature-273.15)], loc='lower center', bbox_to_anchor=(.5, 1.05), ncol=3)

        # Update the legend
        self.ax.legend(loc='lower center', bbox_to_anchor=(.5, 1.05), ncol=3)    
        
        self.canvas.draw()


    def planck_radiation(self, t, T, Skalierung):
        # Berechnen Sie die normierte spektrale spezifische Ausstrahlung gemäß dem Planckschen Strahlungsgesetz
        return 2.90805156249832e+19/(T**5*t**5*(np.exp(14387.7695998382/(T*t)) - 1.0)) * Skalierung

    def determine_csv_delimiter(self, file_path):
        with open(file_path, 'r') as file:
            sample = file.read(1024)  # Read a sample of the file
            #print(sample)
        dialect = csv.Sniffer().sniff(sample)
        #print(dialect.delimiter)
        return dialect.delimiter


    def merge_files(self):
        '''
        Aus dem Dateinamen werden in der Methode extract_info_from_filename Strahlernummer etc. extrahiert
            dieser String ist der column header im dataframe
        Wenn 2 column headers im Dataframe gleich sind, dann gibt es einen Fehler, z.B. für diese Dateien:
            "2023.06.12_14.48.21_HIS2000.9_Zwischenmessung_nach_verkappen_2,5W_2,58V_967,0mA_HC2414_.0.dpt"
            "2023.06.12_14.24.31_HIS2000.9_Zwischenmessung_nach_verkappen_2,5W_2,58V_967,0mA_HC2414_.0.dpt"
        Daher wird hier an jeden header eine index angehangen
        '''
        self.fileindex = 0
        self.dataframes = [pd.read_csv(fn, header=None, delimiter=self.determine_csv_delimiter(fn), names = ['wavenumber', self.extract_info_from_filename(os.path.basename(fn))]) for fn in self.file_names]
        #for i, df in enumerate(self.data_frames):
         #   df.insert(0, 'File', f"File {i+1}")
        #self.merged_data = pd.concat(self.data_frames, axis=1)
        # print(self.dataframes[0].head())
        self.merged_data = pd.concat([self.dataframes[0]] + [df.iloc[:, 1:] for df in self.dataframes[1:]], axis=1)
        #self.merged_data = pd.DataFrame()
        #self.merged_data = pd.concat([pd.DataFrame(columns=['wavenumber'] + list(self.file_names)), self.merged_data1], axis=0)
        #self.file_names.insert(0, 'wavenumber')
        #self.merged_data = pd.concat([pd.DataFrame(columns=self.file_names), self.merged_data1], axis=0)
        #self.merged_data = pd.concat([pd.DataFrame(columns = [self.file_names.insert(0, 'wavenumber')]), self.merged_data1], axis=0)
        #self.merged_data = pd.concat([pd.DataFrame(columns = [('wavenumber',)+ self.file_names]), self.merged_data1], axis=0)


        '''
        Wende die Übertragungsfunktin an
        '''
        self.verrechne_mit_Uebertragungsfunktion()


        self.emissivity = pd.DataFrame()

    def display_merged_data(self):
        self.merged_data_text.delete('1.0', tk.END)
        #header = '\t'.join(map(str, self.merged_data.columns))
        #rest= '\t'.join(map(str, self.merged_data.columns))
        #self.output_text = '\n'.join(['\t'.join(map(str, self.merged_data.columns)), self.merged_data.to_string(index=False, header=False)])
        self.output_text = self.merged_data.to_csv(index=False, header=True, sep='\t', line_terminator='\n')
        self.merged_data_text.insert(tk.END, self.output_text)
        # print(self.output_text)
        
        # self.copy_to_clipboard()
        
    def copy_to_clipboard(self):
        self.master.clipboard_clear()
        self.master.clipboard_append(self.output_text)
        self.show_message_box()
        
    def show_message_box(self):
        messagebox.showinfo('Finished', 'Data has been copied to clipboard!')
        # self.message_box_window = tk.Toplevel(self.master)
        # self.message_box_window.after(1000, self.message_box_window.destroy)
        
    def verrechne_mit_Uebertragungsfunktion(self):
        import numpy as np
        # from scipy.interpolate import interp1d

        # Datei "Uebertragungsfunktion.txt" einlesen
        self.Ubertragungsfunktion_df = pd.read_csv("Uebertragungsfunktion_FTIR.txt", sep="\t")
        
        # reverse dataframe so wavenumber is ascending
        self.merged_data.iloc[:] = self.merged_data.iloc[::-1]
        self.Ubertragungsfunktion_df.iloc[:] = self.Ubertragungsfunktion_df.iloc[::-1]

        # Wellenzahlen aus "merged_data" extrahieren
        # wellenzahlen_merged = merged_data.iloc[:, 0]

        # Übertragungsfunktion für jede Wellenzahl in "merged_data" interpolieren
        self.Ubertragungsfunktion_df_interpoliert = pd.DataFrame()
        self.Ubertragungsfunktion_df_interpoliert[0] = self.merged_data.iloc[:, 0]
        '''numpy'''
        self.Ubertragungsfunktion_df_interpoliert[1] = np.interp(self.merged_data.iloc[:, 0], self.Ubertragungsfunktion_df.iloc[:, 0], self.Ubertragungsfunktion_df.iloc[:, 2])
           

        # Ergebnis ausgeben
        # print(self.Ubertragungsfunktion_df_interpoliert)

        # Spalte 1 von Uebertragungsfunktion mit jeder Spalte von data_merged ab Spalte 2 multiplizieren
        for col in self.merged_data.columns[1:]:
            self.merged_data[col] = self.merged_data[col] / self.Ubertragungsfunktion_df_interpoliert.iloc[:, 1]
    
        
        # lösche letzte Zeile wegen Interpolationsfehler
        self.merged_data.drop(self.merged_data.index[-1], inplace=True)
        
        #print(os.path.dirname(self.file_names[0])+ "/merged_data.txt")
        # self.merged_data.to_csv(os.path.dirname(self.file_names[0])+ "/merged_data.txt")
        
        # sort for wavenumber
        self.merged_data.sort_values(by='wavenumber', ascending=False, inplace=True)
        #print("merged_data" , self.merged_data)


        # change to wavelength and normalize
        self.merged_data.iloc[:, 0] = 10000/self.merged_data.iloc[:, 0] # Wellenzahl in Wellenlaenge
        for col in self.merged_data.columns[1:]:

            self.merged_data[col] = self.merged_data[col] / self.merged_data[col].iloc[2000:2900].max()
   

    def find_strings_with_substring(self, string_list, substring):
        result = []
        for s in string_list:
            if substring in s:
                result.append(s)
        return result


    def save_selected_curve_to_csv_file(self):
        selected_column = self.dropdown_menu.get()
        
        if selected_column == "Alle":
            print("Cannot save all plots to file")
            # columns_to_save = self.merged_data.columns.tolist()[1:]
        else:
            columns_to_save = self.find_strings_with_substring(self.merged_data.columns.tolist()[1:], selected_column)
            # [s for s in self.merged_data.columns.tolist()[1:] if selected_columns in s]

            # Select columns 1 and the columns specified in column_names
            x_y_data = self.merged_data.iloc[:, [0] + [self.merged_data.columns.get_loc(name) for name in columns_to_save]]
            '''
            for selected_column in columns_to_save[0]: # speichert nur die erste Auswahl
                # Save the selected column
                # Select columns 1 and 6
                x_y_data = self.merged_data.iloc[:, [0, self.merged_data.columns.get_loc(selected_column)]]  # Remember, column indices start from 0
            '''
            
            # Save the selected columns to a CSV file
            combined_filename = os.path.join(self.folder_path, f"FTIR_{selected_column}.txt")
            x_y_data.to_csv(combined_filename, index=False)        
    
            print(f"{selected_column}.txt saved successfully.")


    def save_selected_emissivity_to_csv_file(self):
        selected_column = self.dropdown_menu.get()
        
        if selected_column == "Alle":
            print("Cannot save all plots to file")
            # columns_to_save = self.merged_data.columns.tolist()[1:]
        else:
            columns_to_save = self.find_strings_with_substring(self.merged_data.columns.tolist()[1:], selected_column)
            # [s for s in self.merged_data.columns.tolist()[1:] if selected_columns in s]

            # Select columns 1 and the columns specified in column_names
            x_y_data_em = self.emissivity.iloc[:, [0] + [self.emissivity.columns.get_loc(name) for name in columns_to_save]]
            '''
            for selected_column in columns_to_save[0]: # speichert nur die erste Auswahl
                # Save the selected column
                # Select columns 1 and 6
                x_y_data = self.merged_data.iloc[:, [0, self.merged_data.columns.get_loc(selected_column)]]  # Remember, column indices start from 0
            '''
            
            # Save the selected columns to a CSV file
            combined_filename = os.path.join(self.folder_path, f"Emissionsgrad_{selected_column}.txt")
            x_y_data_em.to_csv(combined_filename, index=False)        
    
            print(f"Emissionsgrad_{selected_column}.txt saved successfully.")
      

    def plot_merged_data(self):
        """Plot the selected column from the merged data against the first column."""
        self.ax.clear()  # Clear the previous plot

        # Set plot limits
        self.ax.set_xlim(xmax=15)
        self.ax.set_ylim(ymax=12)
        
        start, end = self.ax.get_xlim()
        self.ax.set_xticks(np.arange(start, end + 0.5, 0.5))
        
        self.ax.grid(which='major', color='gray', linestyle='dotted')
        
        columns_to_plot = self.merged_data.columns.tolist()[1:]
            # [s for s in self.merged_data.columns.tolist()[1:] if selected_columns in s]
        '''
            def find_strings_with_substring(strings, substring):
                    return [s for s in strings if substring in s]
                
            
            strings = [
                "2024.04.23_08.56.48_HIS2000R-C300-9_1.5W_3.02V_494.1mA_HC1694_.0.dpt",
                "2024.04.19_13.31.20_HIS2000R-C300-9_1.5W_3.0V_494.8mA_HC1928_.0.dpt",
                "2024.04.20_10.00.00_FOO2000R-C300-9_1.5W_3.0V_494.8mA_FOO1928_.0.dpt"
            ]
            
            substring = "HC"
            
            result = find_strings_with_substring(strings, substring)
            print(result)
            
            [
                "2024.04.23_08.56.48_HIS2000R-C300-9_1.5W_3.02V_494.1mA_HC1694_.0.dpt",
                "2024.04.19_13.31.20_HIS2000R-C300-9_1.5W_3.0V_494.8mA_HC1928_.0.dpt"
            ]
            '''


        for selected_column in columns_to_plot:
            # Plot the selected column
            self.ax.plot(self.merged_data.iloc[:, 0], self.merged_data[selected_column], label=selected_column)
            print(len(self.merged_data[selected_column].tolist()))

        print(len(self.merged_data[self.merged_data.columns.tolist()[0]].tolist()))
        # Set axis labels and title
        self.ax.set_xlabel('Wavelength in um')
        self.ax.set_ylabel('')
        self.ax.set_title('')

        # Add legend
        self.ax.legend(loc='lower center', bbox_to_anchor=(.5, 1.05), ncol=3)

        # Update the plot canvas
        self.canvas.draw()
        

            

    def plot_merged_data_0(self):
        
        
        
        # Extrahieren der Labels aus der ersten Zeile des DataFrames
        labels = self.merged_data.columns.tolist()[1:] #self.merged_data.iloc[0, 1:].values
        
        # Erstellen des Plots
        self.ax.clear()  # Vor dem Plotten den vorherigen Plot löschen
        #self.ax.figure.set_size_inches(20, 15)  # Größe des Plots anpassen
        

        self.ax.set_xlim(xmax=15)
        self.ax.set_ylim(ymax=1.1)
        
        
        # Iterieren über die restlichen Spalten des DataFrames und plotten sie als y-Achse
        lines = []
        index = 0
        for col in self.merged_data.columns[1:]:
            # print(self.merged_data[col].iloc[2000:2913].max())
            lines.append(self.ax.plot(self.merged_data.iloc[:, 0], self.merged_data[col], label = labels[index]))
            #  ist index für Wellenzahl 4140.92446 -> 2.5um
            #  index für Wellenzahl 2501.52726 -> 4 um
            index += 1
                                                                                                
        # Use a Cursor to interactively display the label for a selected line.
        for line in lines:
            cursor = mplcursors.cursor(line) #, hover = True)
            cursor.connect('add', lambda sel: sel.annotation.set(text=sel.artist.get_label()))                                                                                        
        
        # Hinzufügen der Legende mit den Labels aus der ersten Zeile
        #self.ax.legend()
        #self.ax.legend(labels, loc='upper left', bbox_to_anchor=(1, 1), ncol=2)
        self.ax.legend(labels, loc='lower center', bbox_to_anchor=(.5, 1.05), ncol=3)
        
        # Beschriftung der Achsen und des Titels
        self.ax.set_xlabel('Wavelength in um')
        self.ax.set_ylabel('')
        self.ax.set_title('')
        
        

        # Aktualisieren des Plots im Plot-Widget
        self.canvas.draw()

    def fast_save(self, filename):   
#        self.fig.savefig(os.path.join(self.folder_path, f"FTIR_{filename}.png"), bbox_inches = 'tight')
        combined_filename = os.path.join(self.folder_path, f"FTIR_{filename}")
        self.fig.savefig(f"{combined_filename}.png", bbox_inches='tight')
        print(f"Plot FTIR_{filename}.png saved successfully.")
        
    def save_plot_to_file(self):
        # Open the "Save As" dialog
        #file_path = filedialog.asksaveasfilename(defaultextension=".txt")
        #self.canvas.print_figure() 
        # Open the "Save As" dialog
        

        actual_folder = os.path.basename(os.path.dirname(self.file_names[0]))
        actual_dir = os.path.dirname(self.file_names[0])
        if actual_folder == 'Rohdaten':
            actual_folder = os.path.basename(os.path.dirname(os.path.dirname(self.file_names[0])))
            actual_dir = os.path.dirname(os.path.dirname(self.file_names[0]))
            
        file_path = tkinter.filedialog.asksaveasfilename(defaultextension=".png", 
                                initialdir = actual_dir,
                                initialfile = f'{actual_folder} Auswertung FTIR')
    
        # Check if a file path was selected
        if file_path:
            # Save the plot as a file with the selected file path
            self.fig.savefig(file_path, bbox_inches = 'tight')
            print("Plot saved successfully.")
    
    def extract_info_from_filename(self, filename):
        '''
        Format==0: keine Änderung
        Format==1 ist: "2024.01.05_10.49.00_HIS550R-0_AD1905_500mW_3,35V_149,9mA.0.dpt"
        Format==2 ist -> das neueste ab 2024: "2024.01.31_09.45.08_HIS550R-B_0.5W_3.34V_148.4mA_AE0201_.0.dpt"
        Format==3 ist: "2023.12.13_08.23.51_HIS550R-0WC_500mW_3,38V_147,7mA_AD9821.0.dpt"
        Format==4 ist: "2023.06.12_13.40.54_HIS2000.9_Zwischenmessung_nach_verkappen_2,5W_2,62V_954,9mA_HC2384_.0.dpt"
        
        gewünscht: AE0201 HIS550R-B 0.5W 3.34V 148.4 mA
        '''
        self.fileindex += 1

        Format = 0
        if Format == 0:
            return filename
        elif Format == 1:
            parts = filename.split('_')
            # erzeugt ["2024.01.05", "10.49.00", "HIS550R-0","AD1905","500mW","3,35V","149,9mA.0.dpt"]
            return ' '.join([parts[3], parts[2], parts[4], parts[5], (parts[6].split('.'))[0], str(self.fileindex)])
        elif Format == 2:
            parts = filename.split('_')
            # Assuming the format is consistent and the relevant parts are always in the same positions
            return ' '.join([parts[6], parts[2], parts[3], parts[4], parts[5], str(self.fileindex)])
            '''
            # Example usage:
            filename = '2024.01.31_09.45.08_HIS550R-B_0.5W_3.34V_148.4mA_AE0201_.0.dpt'
            result = extract_info_from_filename(filename)
            print(result) # Output: AE0201 HIS550R-B 0.5W 3.34V 148.4 mA
            '''
        elif Format == 3:
            parts = filename.split('_')
            return ' '.join([(parts[6].split('.'))[0], parts[2], parts[3], parts[4], parts[5], str(self.fileindex)])

        elif Format == 4:
            parts = filename.split('_')
            return ' '.join([parts[9], parts[2], parts[6], parts[7], parts[8], str(self.fileindex)])
        
root = tk.Tk()
gui = FileMergerGUI(root)
gui.display_file_names()
root.mainloop()
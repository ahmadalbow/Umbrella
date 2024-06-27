from django.urls import path, include
from . import views 
urlpatterns = [
    path('', views.getAngeschlosseneGereate),
    path('hmp4040_measure/',views.hmp4040_measure),
    path('hmp4040/set/',views.hmp4040_set),
    path('auto_corrector_switch/',views.auto_corrector_switch),
    path('auto_corrector_remove_ch/',views.auto_corrector_remove_ch),
    path('channel_switch/',views.channel_switch) ,
    path('channel_deaktivieren/',views.channel_deaktivieren) ,
    path('hmp4040/output/',views.output) ,
    path('out_deaktivieren/',views.out_deaktivieren) ,
    path('hmp4040/datalog/',views.datalog) ,
    path('stop_saving_Data/',views.stop_saving_Data),
    path('set_power/',views.set_power),
    path('read_volt/',views.read_voltage),
    path('read_curr/',views.read_curr),
    path('scan/',views.scan),
    path('progressbar/',views.get_progressBar),
    path('set_volt/',views.set_volt),
    path('out_save_status/',views.out_save_status),
   path('get_dpt_data/',views.getDptData),
    path('dpt_to_graph_values/',views.ConvertDptToGraphValues),
    path('save_dpt_in_database/',views.SaveDptInDatabase),

]

from rest_framework import serializers

class DeviceSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    imgName = serializers.CharField(max_length=200)
    ipAdress = serializers.CharField(max_length=200)
# serializers.py

class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

class DptSaveSerializer(serializers.Serializer):
    file = serializers.FileField()
    datum = serializers.DateTimeField(format='%Y-%m-%dT%H:%M', input_formats=['%Y-%m-%dT%H:%M'])
    strahlertyp = serializers.CharField(max_length=255)
    strahlernummer = serializers.CharField(max_length=255)
    volt = serializers.FloatField()
    leistung = serializers.FloatField()
    current = serializers.FloatField()
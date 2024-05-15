from rest_framework import serializers

class DeviceSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    imgName = serializers.CharField(max_length=200)
    ipAdress = serializers.CharField(max_length=200)
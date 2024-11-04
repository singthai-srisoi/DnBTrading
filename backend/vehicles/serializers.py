from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from . import models

class VehicleSerializer(ModelSerializer):
    class Meta:
        model = models.Vehicle
        fields = '__all__'

class VehicleOptionSerializer(ModelSerializer):
    value = serializers.CharField(source='id')
    label = serializers.CharField(source='reg_no')

    class Meta:
        model = models.Vehicle
        fields = ('value', 'label')
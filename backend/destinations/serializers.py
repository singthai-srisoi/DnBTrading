from rest_framework import serializers

from . import models

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Destination
        fields = '__all__'

class DestinationOptionSerializer(serializers.ModelSerializer):
    value = serializers.CharField(source='id')
    label = serializers.SerializerMethodField()

    class Meta:
        model = models.Destination
        fields = ('value', 'label')

    def get_label(self, obj):
        return f"{obj.code} - {obj.name}"
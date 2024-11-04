from rest_framework import serializers
from . import models

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Person
        fields = '__all__'

class PersonOptionSerializer(serializers.ModelSerializer):
    value = serializers.CharField(source='id')
    label = serializers.SerializerMethodField()

    class Meta:
        model = models.Person
        fields = ('value', 'label')

    def get_label(self, obj):
        return f"{obj.code} - {obj.name}"
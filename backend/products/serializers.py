from rest_framework import serializers
from . import models

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields = '__all__'


class ProductTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductType
        fields = '__all__'

class ProductTypeOptionSerializer(serializers.ModelSerializer):
    value = serializers.CharField(source='code')
    label = serializers.CharField(source='name')

    class Meta:
        model = models.ProductType
        fields = ('value', 'label')

class ProductListSerializer(serializers.ModelSerializer):
    type = ProductTypeOptionSerializer(read_only=True)

    class Meta:
        model = models.Product
        fields = ('id', 'name', 'code', 'type', 'price')

class ProductOptionSerializer(serializers.ModelSerializer):
    value = serializers.CharField(source='id')
    label = serializers.SerializerMethodField()

    class Meta:
        model = models.Product
        fields = ('value', 'label')

    def get_label(self, obj):
        return f"{obj.code} - {obj.name}"
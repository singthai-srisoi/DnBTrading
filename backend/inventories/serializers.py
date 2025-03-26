from rest_framework import serializers

from . import models
from vehicles.serializers import VehicleOptionSerializer
from person.serializers import PersonOptionSerializer
from products.serializers import ProductOptionSerializer

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Inventory
        fields = '__all__'

class InventoryGetSerializer(serializers.ModelSerializer):
    vehicle = VehicleOptionSerializer(read_only=True)
    driver = PersonOptionSerializer(read_only=True)
    supplier = PersonOptionSerializer(read_only=True)
    customer = PersonOptionSerializer(read_only=True)
    product = ProductOptionSerializer(read_only=True)

    class Meta:
        model = models.Inventory
        fields = ['id', 'date', 'vehicle', 'driver', 'supplier', 'customer_ticket_no', 'supplier_qty', 'customer', 'product', 'ticket_no', 'do', 'weight_in', 'weight_out', 'factory_nett', 'nett', 'deduction', 'bucket', 'remark']

    def get_fields(self):
        ...
        fields = super().get_fields()
        context_fields = self.context.get('fields', [])

        if context_fields:
            fields = {key: fields[key] for key in fields if key in context_fields}

        return fields


class InventoryDataSerializer(serializers.ModelSerializer):
    # destination = serializers.StringRelatedField()
    vehicle = serializers.StringRelatedField()
    driver = serializers.StringRelatedField()
    supplier = serializers.StringRelatedField()
    customer = serializers.StringRelatedField()
    product = serializers.StringRelatedField()

    class Meta:
        model = models.Inventory
        fields = '__all__'

    def get_fields(self):
        fields = super().get_fields()
        context_fields = self.context.get('fields', [])

        if context_fields:
            fields = {key: fields[key] for key in fields if key in context_fields}

        return fields
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from django.db.models import Q
from . import models
from . import serializers

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = models.Inventory.objects.all()
    serializer_class = serializers.InventorySerializer
    permission_classes = (IsAuthenticated, )

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.InventoryGetSerializer
        return self.serializer_class

    def get_queryset(self):
        queryset = self.queryset
        search = self.request.query_params.get('search', None)
        order = self.request.query_params.get('order', "-id")

        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        query = Q()
        if search:
            query = query | Q(ticket_no__icontains=search) | Q(do__icontains=search) | Q(customer_ticket_no__icontains=search) | Q(remark__icontains=search)

        if start_date:
            query = query & Q(date__gte=start_date)
        if end_date:
            query = query & Q(date__lte=end_date)

        queryset = queryset.filter(query)
        
        if order:
            queryset = queryset.order_by(order)

        return queryset

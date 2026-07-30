from rest_framework import viewsets, status
from rest_framework.response import Response
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

class LastSelectedUnitViewSet(viewsets.GenericViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.LastSelectedUnitSerializer

    def list(self, request, *args, **kwargs):
        """GET request: Retrieve the single row or create it if missing."""
        # Fetches the first record or creates one with defaults
        unit_obj, created = models.LastSelectedUnit.objects.get_or_create(
            id=1,
            defaults={'unit': models.Unit.KG}
        )
        serializer = self.get_serializer(unit_obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """POST request: Updates the existing row or creates it if missing."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # update_or_create on the fixed primary key ensures only 1 row exists
        unit_obj, created = models.LastSelectedUnit.objects.update_or_create(
            id=1,
            defaults={'unit': serializer.validated_data.get('unit')}
        )
        
        out_serializer = self.get_serializer(unit_obj)
        return Response(out_serializer.data, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)
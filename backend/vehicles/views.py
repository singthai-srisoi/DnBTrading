from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from django.db.models import Q, F
from . import models
from . import serializers

class VehicleViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    queryset = models.Vehicle.objects.all()
    serializer_class = serializers.VehicleSerializer

    def get_queryset(self):
        queryset = self.queryset
        search = self.request.query_params.get('search', None)
        order = self.request.query_params.get('order', "-id")

        query = Q()
        if search:
            query = query | Q(reg_no__icontains=search) | Q(model__icontains=search)

        queryset = queryset.filter(query)
        
        if order:
            queryset = queryset.order_by(order)

        return queryset

    @action(detail=False, methods=['get'], url_path='get_options')
    def get_options(self, request):
        queryset = self.get_queryset()
        serializer = serializers.VehicleOptionSerializer(data=queryset, many=True)
        serializer.is_valid()
        return Response(serializer.data)
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from . import models
from . import serializers

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = models.Destination.objects.all()
    serializer_class = serializers.DestinationSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        queryset = self.queryset
        search = self.request.query_params.get('search', None)
        order = self.request.query_params.get('order', "-id")

        query = Q()
        if search:
            query = query | Q(code__icontains=search) | Q(name__icontains=search)

        queryset = queryset.filter(query)
        
        if order:
            queryset = queryset.order_by(order)

        return queryset

    @action(detail=False, methods=['get'], url_path='get_options')
    def get_options(self, request):
        queryset = self.queryset
        serializer = serializers.DestinationOptionSerializer(data=queryset, many=True)
        serializer.is_valid()
        return Response(serializer.data)
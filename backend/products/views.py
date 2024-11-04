from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from . import models
from . import serializers
# import q object to use OR operator
from django.db.models import Q, F

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    queryset = models.Product.objects.all().order_by('-id')
    serializer_class = serializers.ProductSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.ProductListSerializer
        return self.serializer_class

    # apply ordering and search filters
    def get_queryset(self):
        queryset = models.Product.objects.all().order_by('-id')
        search = self.request.query_params.get('search', None)
        order = self.request.query_params.get('order', "-id")

        query = Q()
        if search:
            query = query | Q(name__icontains=search) | Q(code__icontains=search) | Q(type__name__icontains=search)

        queryset = queryset.filter(query)
        
        if order:
            queryset = queryset.order_by(order)

        return queryset

    @action(detail=False, methods=['get'], url_path='get_options')
    def get_options(self, request):
        queryset = self.queryset
        serializer = serializers.ProductOptionSerializer(data=queryset, many=True)
        serializer.is_valid()
        return Response(serializer.data)

class ProductTypeViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    queryset = models.ProductType.objects.all()
    serializer_class = serializers.ProductTypeSerializer

    def get_queryset(self):
        queryset = self.queryset
        search = self.request.query_params.get('search', None)
        order = self.request.query_params.get('order', "-code")

        query = Q()
        if search:
            query = query | Q(name__icontains=search) | Q(code__icontains=search)

        queryset = queryset.filter(query)

        if order:
            queryset = queryset.order_by(order)

        return queryset

    @action(detail=False, methods=['get'], url_path='get_options')
    def get_options(self, request):
        queryset = self.queryset
        serializer = serializers.ProductTypeOptionSerializer(data=queryset, many=True)
        serializer.is_valid()
        return Response(serializer.data)

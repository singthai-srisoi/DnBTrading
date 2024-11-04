from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from django.db.models import Q, F
from . import models
from . import serializers

class PersonViewSet(
    mixins.CreateModelMixin, 
    mixins.UpdateModelMixin, 
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer
    permission_classes = (IsAuthenticated, )

class PersonRetrieveViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        queryset = self.queryset
        search = self.request.query_params.get('search', None)
        order = self.request.query_params.get('order', "-id")

        type = self.kwargs.get('type')
        # print(type)
        query = Q(type=type)
        if search:
            query = query & (Q(code__icontains=search) | Q(name__icontains=search) | Q(phone__icontains=search) | Q(ic__icontains=search))

        queryset = queryset.filter(query)

        if order:
            queryset = queryset.order_by(order)

        return queryset

    # @action(detail=False, methods=['get'], url_path='get_options')
    # def get_options(self, request):
    #     print('get options')
    #     type = self.kwargs.get('type')
    #     print(type)
    #     print(type)
    #     queryset = self.queryset.filter(type=type)
    #     serializer = serializers.PersonOptionSerializer(data=queryset, many=True)
    #     serializer.is_valid()
    #     return Response(serializer.data)

class PersonGetOptionsViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonOptionSerializer
    permission_classes = (IsAuthenticated, )
    pagination_class = None


    def get_queryset(self):
        queryset = self.queryset
        type = self.kwargs.get('type')
        queryset = queryset.filter(type=type)
        return queryset
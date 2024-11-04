from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'persons', views.PersonViewSet)

urlpatterns = [
    path('', include(router.urls)),
    re_path('^person/(?P<type>.+)/$', views.PersonRetrieveViewSet.as_view(
        {'get': 'list'}
    )),
    re_path('^person_options/(?P<type>.+)/$', views.PersonGetOptionsViewSet.as_view(
        {'get': 'list'}
    )),
]
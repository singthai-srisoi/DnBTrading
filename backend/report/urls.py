from django.urls import path, include

from . import views

urlpatterns = [
    path('report/', views.ReportDataViewSet.as_view(), name='report_data'),
    path('dashboard/', views.HomePageOverviewViewSet.as_view(), name='home_page_overview'),
]
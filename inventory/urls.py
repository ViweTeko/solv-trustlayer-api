""" 
URL configuration for Inventory app
"""
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import UnitViewSet, OrganizationViewSet

router = DefaultRouter()
router.register(r'units', UnitViewSet)
router.register(r'organization', OrganizationViewSet)

urlpatterns = [
    path('', include(router.urls))
]
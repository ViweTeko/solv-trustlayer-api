from rest_framework import viewsets
from .models import Unit, Organization
from .serializers import UnitSerializer, OrganizationSerializer

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

class UnitViewSet(viewsets.ModelViewSet):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

#   def get_queryset(self):
#   """Filters users to only see their own units"""
#       return Unit.objects.filter(current_owner=self.request.user.organization)
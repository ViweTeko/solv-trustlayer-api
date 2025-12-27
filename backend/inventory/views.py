from rest_framework import exceptions, permissions, viewsets

from .models import Organization, Unit
from .serializers import OrganizationSerializer, UnitSerializer


class OrganizationViewSet(viewsets.ModelViewSet):
    """ Read-only viewset for Organizations."""
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]  # noqa: RUF012
    

class UnitViewSet(viewsets.ModelViewSet):
    """ CRUD viewset for Units. """
    # queryset = Unit.objects.all()
    serializer_class = UnitSerializer
    permission_classes = [permissions.IsAuthenticated]  # noqa: RUF012

    def get_queryset(self):
        """Filters users to only see their own units"""
        user = self.request.users
        if hasattr(user, 'organization') and user.organization:
            return Unit.objects.filter(current_owner=user.organization)
        return Unit.objects.none()

    def perform_create(self, serializer):
        """Sets the current_owner to the user's organization"""
        user = self.request.user
        if not hasattr(user, 'organization') or not user.organization:
            raise exceptions.PermissionDenied(
                "User must belong to an Organization to create units."
            )
        serializer.save(current_owner=user.organization)
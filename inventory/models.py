"""
This script is the model that communicates with the database
"""
from django.db import models
import uuid

class Organization(models.Model):
    """ This class defines the Organization table"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    type = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.name

class Unit(models.Model):
    """ This class defines the Unit table"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    weight = models.FloatField()

    UNIT_TYPES = (
        ('HARVEST', 'Harvested Raw Material'),
        ('PROCESSED', 'Processed Product'),
    )
    unit_type = models.CharField(max_length=20, choices=UNIT_TYPES)

    current_owner = models.ForeignKey(
        Organization,
        on_delete=models.PROTECT,
        related_name='owned_units'
    )

    parent_unit = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='child_units'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.weight}kg)"

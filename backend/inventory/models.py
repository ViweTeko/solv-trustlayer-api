"""
This script is the model that communicates with the database
"""
import uuid

from django.db import models

UNIT_TYPES = (
    ('HARVEST', 'Harvested Raw Material'),
    ('PROCESSED', 'Processed Product'),
    ('FINAL', 'Final Consumer Product'),
)

UNIT_STATUSES = (
    ('ACTIVE', 'Active in Inventory'),
    ('TRANSIT', 'In Transit'),
    ('ARCHIVED', 'Archived/Sold'),
    ('DISPOSED', 'Disposed/Destroyed'),
)

LAB_TEST_STATUSES = (
    ('PENDING', 'Lab Test Pending'),
    ('PASS', 'Test Passed'),
    ('FAIL', 'Test Failed'),
)

class Organization(models.Model):
    """ This class defines the Organization table"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    licence_number = models.CharField(max_length=50, unique=True, default='N/A')
    address = models.CharField(max_length=255, default='N/A')
    contact_email = models.EmailField(max_length=255, default='No Email Address')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self) -> str:
        return self.name

class Unit(models.Model):
    """ This class defines the Unit table"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    weight = models.FloatField()
    unit_type = models.CharField(max_length=20, choices=UNIT_TYPES, default='HARVEST')

    status = models.CharField(max_length=20, choices=UNIT_STATUSES, default='ACTIVE')
    lab_test_status = models.CharField(max_length=10, choices=LAB_TEST_STATUSES, default='PENDING')
    storage_location = models.CharField(max_length=255, default='Unknown')
    description = models.TextField(blank=True, null=True)

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

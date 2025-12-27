"""
This script is the model that communicates with the database
"""
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import TextChoices
from django.utils import timezone

from inventory.models import Organization

class UnitType(TextChoices):
    HARVEST = 'HARVEST','Harvested Raw Material'
    PROCESSED = 'PROCESSED', 'Processed Product'
    FINAL = 'FINAL', 'Final Product'


class UnitStatus(TextChoices):
    ACTIVE = 'ACTIVE', 'Active in Inventory'
    TRANSIT = 'TRANSIT', 'In Transit'
    ARCHIVED = 'ARCHIVED', 'Archived/Sold'
    DISPOSED = 'DISPOSED', 'Disposed/Destroyed'


class LabTestStatus(TextChoices):
    PENDING = 'PENDING', 'Lab Test Pending'
    PASS = 'PASS', 'Passed'
    FAIL = 'FAIL', 'Failed'

class QualityGrade(TextChoices):
        GRADE_A = 'A', 'Grade A (Premium)'
        GRADE_B = 'B', 'Grade B (Standard)'
        GRADE_C = 'C', 'Grade C (Low)'
        PENDING = 'PENDING', 'Pending'


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
    cultivar_name = models.CharField(max_length=100)
    weight = models.FloatField()
    unit_type = models.CharField(
        max_length=20,
        choices=UnitType.choices,
        default=UnitType.HARVEST
    )
    date_harvested = models.DateField(default=timezone.now)
    status = models.CharField(
        max_length=20,
        choices=UnitStatus.choices,
        default=UnitStatus.ACTIVE
    )
    lab_test_status = models.CharField(
        max_length=10,
        choices=LabTestStatus.choices,
        default=LabTestStatus.PENDING
    )
    storage_location = models.CharField(max_length=255, default='Unknown', help_text="e.g., 34.0552, -110.5523")
    gps_coordinates = models.CharField(max_length=50, default='Unknown')
    quality_grade = models.CharField(
        max_length=50,
        choices=QualityGrade.choices,
        default=QualityGrade.PENDING
    )

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
        related_name='processed_units'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f"{self.cultivar_name} ({self.id})"

class User(AbstractUser):
    """ Links every user to an Organization """
    organization = models.ForeignKey(
        'inventory.Organization',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='users'
    )

    ROLE_CHOICE = (
        ('ADMIN', 'Admin'),
        ('WORKER', 'Worker'),
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICE,
        default='WORKER'
    )

    def __str__(self):
        if self.organization:
            return f"{self.username} ({self.organization.name})"
        return f"{self.username} (No Org)"
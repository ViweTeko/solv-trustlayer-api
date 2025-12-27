"""
This script converts the models into JSON for the API
"""
from typing import Any  # noqa: F401

from rest_framework import serializers

from .models import Organization, Unit


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = [  # noqa: RUF012
            'id', 'name', 'licence_number', 'address',
            'contact_email', 'is_active', 'created_at'
            ]
        read_only_fields = ['id', 'created_at']  # noqa: RUF012



class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = [  # noqa: RUF012
            'id',
            'cultivar_name',
            'weight',
            'unit_type',
            'current_owner',
            'parent_unit',
            'created_at',
            'status',
            'lab_test_status',
            'storage_location',
            'description',
            'gps_coordinates',
            'quality_grade',
            'date_harvested'
            ]
        read_only_fields = ['id', 'created_at','current_owner']  # noqa: RUF012

    def validate_weight(self, value: float) -> float:
        """ This validates the weight"""
        if value <= 0:
            raise serializers.ValidationError("Weight must be positive.")
        return value
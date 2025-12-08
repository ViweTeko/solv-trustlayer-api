"""
This script converts the models into JSON for the API
"""
from typing import Any  # noqa: F401

from rest_framework import serializers

from .models import Organization, Unit


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'type']  # noqa: RUF012

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = [  # noqa: RUF012
            'id',
            'name',
            'weight',
            'unit_type',
            'current_owner',
            'parent_unit',
            'created_at',
            'status',
            'lab_test_status',
            'storage_location',
            'description',
            ]
        read_only_fields = ['id', 'created_at']  # noqa: RUF012

        def validate_weight(self, value: float) -> float:
            """ This validates the weight"""
            if value <= 0:
                raise serializers.ValidationError("Weight must be positive.")
            return value
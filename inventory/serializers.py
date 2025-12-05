"""
This script converts the models into JSON for the API
"""
from rest_framework import serializers
from .models import Unit, Organization
from typing import Any

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'type']

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ['id', 'name', 'weight', 'unit_type', 'current_owner', 'parent_unit', 'created_at']
        read_only_fields = ['id', 'created_at']

        def validate_weight(self, value: float) -> float:
            """ This validates the weight"""
            if value <= 0:
                raise serializers.ValidationError("Weight must be positive.")
            return value
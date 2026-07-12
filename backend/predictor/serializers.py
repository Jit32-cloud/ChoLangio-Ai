"""DRF serializers for predictor endpoints."""

from rest_framework import serializers

from .models import PredictionSession


class ReadyResponseSerializer(serializers.Serializer):
    """Standard placeholder response schema."""

    status = serializers.CharField()
    service = serializers.CharField(required=False)


class PredictionSessionSerializer(serializers.ModelSerializer):
    """Serializer for prediction session records."""

    class Meta:
        model = PredictionSession
        fields = ["id", "created_at", "updated_at"]
        read_only_fields = fields


class ChatRequestSerializer(serializers.Serializer):
    """Placeholder request schema for chat endpoints."""

    message = serializers.CharField(required=False, allow_blank=True)


class PredictionRequestSerializer(serializers.Serializer):
    """Placeholder request schema for prediction endpoints."""

    payload = serializers.JSONField(required=False)


class ReportRequestSerializer(serializers.Serializer):
    """Placeholder request schema for report analysis endpoints."""

    report_text = serializers.CharField(required=False, allow_blank=True)
    report_type = serializers.CharField(required=False, allow_blank=True)


class LabRequestSerializer(serializers.Serializer):
    """Placeholder request schema for lab interpretation endpoints."""

    labs = serializers.JSONField(required=False)


class ImagingRequestSerializer(serializers.Serializer):
    """Placeholder request schema for imaging endpoints."""

    report_text = serializers.CharField(required=False, allow_blank=True)
    modality = serializers.CharField(required=False, allow_blank=True)


class RiskRequestSerializer(serializers.Serializer):
    """Placeholder request schema for risk assessment endpoints."""

    data = serializers.JSONField(required=False)

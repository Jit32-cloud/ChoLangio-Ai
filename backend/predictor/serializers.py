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


class ChatMessageSerializer(serializers.Serializer):
    """Single chat message from the frontend."""

    role = serializers.CharField(required=False, allow_blank=True)
    content = serializers.CharField(required=False, allow_blank=True)


class ChatRequestSerializer(serializers.Serializer):
    """Request schema matching POST /api/chat payload."""

    messages = ChatMessageSerializer(many=True, required=False)


class PredictionRequestSerializer(serializers.Serializer):
    """Placeholder request schema for prediction endpoints."""

    payload = serializers.JSONField(required=False)


class SymptomsRequestSerializer(serializers.Serializer):
    """Request schema matching POST /api/analyze-symptoms payload."""

    jaundice = serializers.IntegerField(required=False, min_value=0, max_value=3)
    abdominalPain = serializers.IntegerField(required=False, min_value=0, max_value=3)
    weightLoss = serializers.IntegerField(required=False, min_value=0, max_value=3)
    fatigue = serializers.IntegerField(required=False, min_value=0, max_value=3)
    pruritus = serializers.IntegerField(required=False, min_value=0, max_value=3)
    darkUrine = serializers.IntegerField(required=False, min_value=0, max_value=3)
    paleStools = serializers.IntegerField(required=False, min_value=0, max_value=3)
    fever = serializers.IntegerField(required=False, min_value=0, max_value=3)
    nausea = serializers.IntegerField(required=False, min_value=0, max_value=3)
    lossOfAppetite = serializers.IntegerField(required=False, min_value=0, max_value=3)
    duration = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)


class ReportRequestSerializer(serializers.Serializer):
    """Request schema matching POST /api/analyze-report payload."""

    reportText = serializers.CharField(required=False, allow_blank=True)
    reportType = serializers.CharField(required=False, allow_blank=True)


class LabRequestSerializer(serializers.Serializer):
    """Request schema matching POST /api/lab-interpret payload."""

    testedAt = serializers.CharField(required=False, allow_blank=True)
    bilirubinTotal = serializers.FloatField(required=False, allow_null=True)
    bilirubinDirect = serializers.FloatField(required=False, allow_null=True)
    alp = serializers.FloatField(required=False, allow_null=True)
    ggt = serializers.FloatField(required=False, allow_null=True)
    ast = serializers.FloatField(required=False, allow_null=True)
    alt = serializers.FloatField(required=False, allow_null=True)
    ca199 = serializers.FloatField(required=False, allow_null=True)
    albumin = serializers.FloatField(required=False, allow_null=True)
    inr = serializers.FloatField(required=False, allow_null=True)


class ImagingRequestSerializer(serializers.Serializer):
    """Request schema matching POST /api/imaging-interpret payload."""

    text = serializers.CharField(required=False, allow_blank=True)
    modality = serializers.CharField(required=False, allow_blank=True)


class FollowupRequestSerializer(serializers.Serializer):
    """Request schema matching POST /api/follow-up payload."""

    context = serializers.CharField(required=False, allow_blank=True)


class EducationRequestSerializer(serializers.Serializer):
    """Request schema matching POST /api/education payload."""

    topic = serializers.CharField(required=False, allow_blank=True)


class DoctorRequestSerializer(serializers.Serializer):
    """Request schema matching POST /api/doctor-prep payload."""

    appointmentType = serializers.CharField(required=False, allow_blank=True)
    context = serializers.CharField(required=False, allow_blank=True)


class HealthPlanRequestSerializer(serializers.Serializer):
    """Request schema matching POST /api/health-plan payload."""

    def to_internal_value(self, data):
        if not isinstance(data, dict):
            raise serializers.ValidationError("Expected a JSON object.")
        return data


class RiskRequestSerializer(serializers.Serializer):
    """Request schema matching POST /api/cca-assessment payload."""

    patientName = serializers.CharField(required=False, allow_blank=True)
    age = serializers.IntegerField(required=False, allow_null=True)
    sex = serializers.CharField(required=False, allow_blank=True)
    weightKg = serializers.FloatField(required=False, allow_null=True)
    heightCm = serializers.FloatField(required=False, allow_null=True)
    country = serializers.CharField(required=False, allow_blank=True)
    ethnicity = serializers.CharField(required=False, allow_blank=True)
    bmi = serializers.FloatField(required=False, allow_null=True)
    smokingStatus = serializers.CharField(required=False, allow_blank=True)
    smokingYears = serializers.CharField(required=False, allow_blank=True)
    cigarettesPerDay = serializers.CharField(required=False, allow_blank=True)
    alcoholUnitsWeek = serializers.CharField(required=False, allow_blank=True)
    physicalActivity = serializers.CharField(required=False, allow_blank=True)
    sedentaryHoursDay = serializers.CharField(required=False, allow_blank=True)
    sleepHours = serializers.CharField(required=False, allow_blank=True)
    sleepQuality = serializers.CharField(required=False, allow_blank=True)
    stressLevel = serializers.IntegerField(required=False, allow_null=True)
    vegetableServings = serializers.CharField(required=False, allow_blank=True)
    fruitServings = serializers.CharField(required=False, allow_blank=True)
    waterLitresDay = serializers.CharField(required=False, allow_blank=True)
    sugaryDrinksDay = serializers.CharField(required=False, allow_blank=True)
    fastFoodPerWeek = serializers.CharField(required=False, allow_blank=True)
    processedFoodScore = serializers.IntegerField(required=False, allow_null=True)
    redMeatPerWeek = serializers.CharField(required=False, allow_blank=True)
    friedFoodPerWeek = serializers.CharField(required=False, allow_blank=True)
    fiberAdequate = serializers.BooleanField(required=False)
    saltIntake = serializers.CharField(required=False, allow_blank=True)
    cookingOilType = serializers.CharField(required=False, allow_blank=True)
    mealTimingRegular = serializers.BooleanField(required=False)
    lateNightEating = serializers.BooleanField(required=False)
    primarySclerosingCholangitis = serializers.BooleanField(required=False)
    hepatitisC = serializers.BooleanField(required=False)
    hepatitisB = serializers.BooleanField(required=False)
    liverFlukeExposure = serializers.BooleanField(required=False)
    gallstones = serializers.BooleanField(required=False)
    liverDisease = serializers.BooleanField(required=False)
    fattyLiver = serializers.BooleanField(required=False)
    diabetes = serializers.BooleanField(required=False)
    obesity = serializers.BooleanField(required=False)
    familyHistoryBileDuctCancer = serializers.BooleanField(required=False)
    familyHistoryLiverCancer = serializers.BooleanField(required=False)
    previousBiliaryDisorders = serializers.BooleanField(required=False)
    jaundice = serializers.IntegerField(required=False, min_value=0, max_value=3)
    abdominalPain = serializers.IntegerField(required=False, min_value=0, max_value=3)
    weightLoss = serializers.IntegerField(required=False, min_value=0, max_value=3)
    fatigue = serializers.IntegerField(required=False, min_value=0, max_value=3)
    pruritus = serializers.IntegerField(required=False, min_value=0, max_value=3)
    darkUrine = serializers.IntegerField(required=False, min_value=0, max_value=3)
    paleStools = serializers.IntegerField(required=False, min_value=0, max_value=3)
    fever = serializers.IntegerField(required=False, min_value=0, max_value=3)
    nausea = serializers.IntegerField(required=False, min_value=0, max_value=3)
    lossOfAppetite = serializers.IntegerField(required=False, min_value=0, max_value=3)

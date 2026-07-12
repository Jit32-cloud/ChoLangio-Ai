"""API views for the predictor app."""

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    ChatRequestSerializer,
    DoctorRequestSerializer,
    EducationRequestSerializer,
    FollowupRequestSerializer,
    HealthPlanRequestSerializer,
    ImagingRequestSerializer,
    LabRequestSerializer,
    PredictionRequestSerializer,
    ReportRequestSerializer,
    RiskRequestSerializer,
    SymptomsRequestSerializer,
)
from .services import (
    ChatService,
    DoctorService,
    EducationService,
    FollowupService,
    GeminiService,
    HealthPlanService,
    ImagingService,
    LabService,
    PredictionService,
    ReportService,
    RiskService,
    SymptomsService,
)

@api_view(["GET"])
def health_check(request: Request) -> Response:
    """Health check endpoint for the predictor app."""
    return Response({"status": "ready", "app": "predictor"})


class _PlaceholderServiceView(APIView):
    """Base view that delegates to a service and returns a ready response."""

    service_class = None
    request_serializer_class = None

    def post(self, request: Request) -> Response:
        if self.request_serializer_class is not None:
            serializer = self.request_serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            payload = serializer.validated_data
        else:
            payload = request.data

        service = self.service_class()
        return Response(service.process(payload), status=status.HTTP_200_OK)

    def get(self, request: Request) -> Response:
        service = self.service_class()
        return Response(service.process(), status=status.HTTP_200_OK)


class SymptomsView(_PlaceholderServiceView):
    service_class = SymptomsService
    request_serializer_class = SymptomsRequestSerializer


class ChatView(_PlaceholderServiceView):
    service_class = ChatService
    request_serializer_class = ChatRequestSerializer


class PredictionView(_PlaceholderServiceView):
    service_class = PredictionService
    request_serializer_class = PredictionRequestSerializer


class GeminiView(_PlaceholderServiceView):
    service_class = GeminiService


class ReportView(_PlaceholderServiceView):
    service_class = ReportService
    request_serializer_class = ReportRequestSerializer


class LabView(_PlaceholderServiceView):
    service_class = LabService
    request_serializer_class = LabRequestSerializer


class ImagingView(_PlaceholderServiceView):
    service_class = ImagingService
    request_serializer_class = ImagingRequestSerializer


class EducationView(_PlaceholderServiceView):
    service_class = EducationService
    request_serializer_class = EducationRequestSerializer


class DoctorView(_PlaceholderServiceView):
    service_class = DoctorService
    request_serializer_class = DoctorRequestSerializer


class HealthPlanView(_PlaceholderServiceView):
    service_class = HealthPlanService
    request_serializer_class = HealthPlanRequestSerializer


class FollowupView(_PlaceholderServiceView):
    service_class = FollowupService
    request_serializer_class = FollowupRequestSerializer


class RiskView(_PlaceholderServiceView):
    service_class = RiskService
    request_serializer_class = RiskRequestSerializer

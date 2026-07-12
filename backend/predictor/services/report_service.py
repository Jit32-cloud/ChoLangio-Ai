"""Placeholder service for medical report analysis."""

from predictor.utils.helpers import build_ready_response


class ReportService:
    """Handles report analysis requests. Logic to be implemented."""

    def process(self, data: dict | None = None) -> dict:
        """Process a report analysis request. Returns a placeholder response."""
        return build_ready_response(service="report")

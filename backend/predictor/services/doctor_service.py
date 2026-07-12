"""Placeholder service for doctor visit preparation."""

from predictor.utils.helpers import build_ready_response


class DoctorService:
    """Handles doctor preparation requests. Logic to be implemented."""

    def process(self, data: dict | None = None) -> dict:
        """Process a doctor preparation request. Returns a placeholder response."""
        return build_ready_response(service="doctor")

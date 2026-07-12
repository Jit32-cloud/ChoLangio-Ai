"""Placeholder service for patient education content."""

from predictor.utils.helpers import build_ready_response


class EducationService:
    """Handles education content requests. Logic to be implemented."""

    def process(self, data: dict | None = None) -> dict:
        """Process an education request. Returns a placeholder response."""
        return build_ready_response(service="education")

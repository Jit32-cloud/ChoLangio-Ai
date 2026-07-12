"""Placeholder service for imaging report interpretation."""

from predictor.utils.helpers import build_ready_response


class ImagingService:
    """Handles imaging interpretation requests. Logic to be implemented."""

    def process(self, data: dict | None = None) -> dict:
        """Process an imaging request. Returns a placeholder response."""
        return build_ready_response(service="imaging")

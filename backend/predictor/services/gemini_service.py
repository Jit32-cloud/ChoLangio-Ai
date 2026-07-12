"""Placeholder service for Gemini AI integration."""

from predictor.utils.helpers import build_ready_response


class GeminiService:
    """Handles Gemini API calls. Logic to be implemented."""

    def process(self, data: dict | None = None) -> dict:
        """Process a Gemini request. Returns a placeholder response."""
        return build_ready_response(service="gemini")

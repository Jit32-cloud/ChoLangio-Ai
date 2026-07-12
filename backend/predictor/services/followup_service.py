"""Placeholder service for follow-up tracking."""

from predictor.utils.helpers import build_ready_response


class FollowupService:
    """Handles follow-up tracking requests. Logic to be implemented."""

    def process(self, data: dict | None = None) -> dict:
        """Process a follow-up request. Returns a placeholder response."""
        return build_ready_response(service="followup")

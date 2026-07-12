"""Placeholder service for AI chat interactions."""

from predictor.utils.helpers import build_ready_response


class ChatService:
    """Handles chat message processing. Logic to be implemented."""

    def process(self, data: dict | None = None) -> dict:
        """Process a chat request. Returns a placeholder response."""
        return build_ready_response(service="chat")

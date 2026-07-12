"""Helper functions used across predictor views and services."""


def build_ready_response(service: str | None = None) -> dict:
    """Return a standardized placeholder API response."""
    response = {"status": "ready"}
    if service:
        response["service"] = service
    return response

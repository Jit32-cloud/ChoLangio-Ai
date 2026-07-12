"""Input validation helpers for predictor endpoints."""


def validate_non_empty_string(value: str, field_name: str) -> str | None:
    """Return an error message if value is not a non-empty string, else None."""
    if not isinstance(value, str) or not value.strip():
        return f"{field_name} must be a non-empty string."
    return None

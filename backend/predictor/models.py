"""
Database models for the predictor app.

Models are defined as placeholders for future persistence.
No migrations are required until fields are finalized.
"""

from django.db import models


class PredictionSession(models.Model):
    """Stores a single prediction or assessment session."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Prediction Session"
        verbose_name_plural = "Prediction Sessions"

    def __str__(self) -> str:
        return f"PredictionSession #{self.pk}"

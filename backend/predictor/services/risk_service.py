"""CCA risk assessment service backed by the pretrained ML models."""

from __future__ import annotations

import math
from typing import Any

from predictor.ml import map_risk_request_to_patient, predict


_BAND_PHRASE = {
    "Low": "Low risk",
    "Moderate": "Moderate",
    "High": "High risk",
    "Very High": "Very High",
}


def _safe_number(value: Any) -> float | None:
    if value is None:
        return None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if math.isnan(number) or math.isinf(number):
        return None
    return number


def _build_analysis(result: dict) -> str:
    band = result.get("risk_band", "Unknown")
    phrase = _BAND_PHRASE.get(band, band)
    probability = result.get("probability")
    model = result.get("model", "unknown")
    agreement = result.get("model_agreement", "unknown")
    pct = f"{probability * 100:.1f}%" if isinstance(probability, (int, float)) else "n/a"

    lines = [
        f"<p><strong>{phrase}</strong> - estimated elevated CCA risk probability "
        f"<strong>{pct}</strong> (primary model: {model}; model agreement: {agreement}).</p>",
        "<p>This estimate is for research / educational use only and is not a clinical diagnosis.</p>",
    ]

    explanation = result.get("explanation") or []
    if explanation:
        lines.append("<p><strong>Top contributing factors:</strong></p><ul>")
        for item in explanation[:5]:
            shap = item.get("shap", 0.0) or 0.0
            direction = "increases" if shap > 0 else "decreases"
            label = item.get("label") or item.get("feature") or "feature"
            value = _safe_number(item.get("value"))
            value_text = "missing (imputed)" if value is None else str(value)
            lines.append(
                f"<li>{label}: {value_text} ({direction} risk, SHAP {shap:+.3f})</li>"
            )
        lines.append("</ul>")
    return "\n".join(lines)


def _sanitize_explanation(explanation: list | None) -> list:
    cleaned = []
    for item in explanation or []:
        cleaned.append({
            "feature": item.get("feature"),
            "label": item.get("label"),
            "value": _safe_number(item.get("value")),
            "shap": _safe_number(item.get("shap")),
        })
    return cleaned


class RiskService:
    """Runs CCA risk inference using cached pretrained pipelines."""

    def process(self, data: dict | None = None) -> dict:
        """Map frontend fields, run prediction, return structured + narrative result."""
        patient = map_risk_request_to_patient(data)
        result = predict(patient, explain=True)

        return {
            "status": "ok",
            "service": "risk",
            "probability": result["probability"],
            "risk_band": result["risk_band"],
            "model": result["model"],
            "all_models": result["all_models"],
            "model_agreement": result["model_agreement"],
            "explanation": _sanitize_explanation(result.get("explanation")),
            "features_used": patient,
            "analysis": _build_analysis(result),
        }

"""
predict.py — score one patient. Used by Django RiskService.

predict(patient: dict, model=None) -> dict with:
  probability   P(elevated CCA risk)
  risk_band     Low / Moderate / High / Very High
  model         which model produced it
  explanation   top SHAP feature contributions (list)
  all_models    every model's probability (for comparison)

Missing feature keys are allowed — they're filled with NaN and imputed by the
pipeline, so a partial questionnaire still yields an estimate.
"""

import glob
import json
import os

import joblib
import numpy as np
import pandas as pd

from .data import make_synthetic
from .explain import explain_patient
from .schema import FEATURES, risk_band

ARTIFACT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "artifacts")
_CACHE: dict = {}


def _load_all():
    """Load every saved model + the primary name. Cached after first call."""
    if _CACHE:
        return _CACHE
    primary_path = os.path.join(ARTIFACT_DIR, "primary_model.txt")
    if not os.path.exists(primary_path):
        raise FileNotFoundError(
            "No artifacts found. Ensure predictor/ml/artifacts contains trained .joblib files."
        )
    with open(primary_path, encoding="utf-8") as f:
        primary = f.read().strip()

    models = {}
    for path in glob.glob(os.path.join(ARTIFACT_DIR, "*.joblib")):
        base = os.path.splitext(os.path.basename(path))[0]
        if base.endswith("_calibrated"):
            continue  # calibrated variants are for analysis, not the model list
        models[_unslug(base)] = joblib.load(path)

    if not models:
        raise FileNotFoundError(
            f"No .joblib model files found in {ARTIFACT_DIR}."
        )
    if primary not in models:
        raise KeyError(
            f"Primary model '{primary}' not found among loaded models: {list(models)}"
        )

    feature_path = os.path.join(ARTIFACT_DIR, "feature_columns.json")
    if os.path.exists(feature_path):
        with open(feature_path, encoding="utf-8") as f:
            saved_features = json.load(f)
        if saved_features != FEATURES:
            raise ValueError(
                "feature_columns.json does not match schema.FEATURES; "
                "refusing to predict with a schema mismatch."
            )

    _CACHE["models"] = models
    _CACHE["primary"] = primary
    # small background sample for non-tree SHAP explainers
    _CACHE["background"] = make_synthetic(n=100, seed=7)[FEATURES]
    return _CACHE


def _unslug(slug):
    return {
        "logistic_regression": "Logistic Regression",
        "decision_tree": "Decision Tree",
        "random_forest": "Random Forest",
        "xgboost": "XGBoost",
        "lightgbm": "LightGBM",
    }.get(slug, slug)


def _row(patient: dict) -> pd.DataFrame:
    """Build a single-row DataFrame, NaN for anything the caller omitted."""
    data = {f: [patient.get(f, np.nan)] for f in FEATURES}
    return pd.DataFrame(data)[FEATURES]


def predict(patient: dict, model: str | None = None, explain: bool = True) -> dict:
    ctx = _load_all()
    models = ctx["models"]
    primary = model or ctx["primary"]
    row = _row(patient)

    # every model's probability, for the comparison view
    all_probs = {}
    for name, m in models.items():
        all_probs[name] = float(m.predict_proba(row)[:, 1][0])

    p = all_probs[primary]
    result = {
        "probability": round(p, 4),
        "risk_band": risk_band(p),
        "model": primary,
        "all_models": {k: round(v, 4) for k, v in all_probs.items()},
        "model_agreement": _agreement(all_probs),
    }
    if explain:
        result["explanation"] = explain_patient(
            models[primary], row, background=ctx["background"])[:8]
    return result


def _agreement(all_probs):
    """Report whether models agree on the band — a confidence signal."""
    bands = {risk_band(p) for p in all_probs.values()}
    return "unanimous" if len(bands) == 1 else "split"


def clear_cache():
    """Clear the in-memory model cache (mainly for tests)."""
    _CACHE.clear()

"""Map frontend / RiskRequestSerializer fields onto the ML schema."""

from __future__ import annotations

import math
import re
from typing import Any


def _as_float(value: Any) -> float | None:
    if value is None or value == "":
        return None
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        if isinstance(value, float) and math.isnan(value):
            return None
        return float(value)
    text = str(value).strip()
    if not text:
        return None
    match = re.search(r"-?\d+(?:\.\d+)?", text.replace(",", ""))
    if not match:
        return None
    try:
        return float(match.group(0))
    except ValueError:
        return None


def _as_bool01(value: Any) -> int | None:
    if value is None or value == "":
        return None
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, (int, float)):
        return int(bool(value))
    text = str(value).strip().lower()
    if text in {"1", "true", "yes", "y"}:
        return 1
    if text in {"0", "false", "no", "n"}:
        return 0
    return None


def _map_sex(value: Any) -> int | None:
    if value is None or value == "":
        return None
    text = str(value).strip().lower()
    if text in {"male", "m", "1"}:
        return 1
    if text in {"female", "f", "0"}:
        return 0
    return _as_bool01(value)


def _map_se_asian(ethnicity: Any) -> int | None:
    if ethnicity is None or ethnicity == "":
        return None
    text = str(ethnicity).strip().lower().replace("_", "-").replace(" ", "-")
    if text in {"southeast-asian", "south-east-asian", "se-asian", "southeastasian"}:
        return 1
    return 0


def _map_smoker(smoking_status: Any) -> int | None:
    if smoking_status is None or smoking_status == "":
        return None
    text = str(smoking_status).strip().lower()
    if text in {"never", "non-smoker", "nonsmoker", "no"}:
        return 0
    # current, former, occasional, etc.
    return 1


def _compute_bmi(data: dict) -> float | None:
    bmi = _as_float(data.get("bmi"))
    if bmi is not None:
        return bmi
    weight = _as_float(data.get("weightKg"))
    height_cm = _as_float(data.get("heightCm"))
    if weight is None or height_cm is None or height_cm <= 0:
        return None
    height_m = height_cm / 100.0
    return round(weight / (height_m * height_m), 1)


def map_risk_request_to_patient(data: dict | None) -> dict:
    """Convert camelCase API payload into ML schema feature dict.

    Omitted / unparseable fields are left out so predict() can impute NaNs.
    Optional lab fields are accepted if present (for future lab merge).
    """
    data = data or {}
    patient: dict[str, float | int] = {}

    age = _as_float(data.get("age"))
    if age is not None:
        patient["age"] = age

    bmi = _compute_bmi(data)
    if bmi is not None:
        patient["bmi"] = bmi

    alcohol = _as_float(data.get("alcoholUnitsWeek"))
    if alcohol is not None:
        patient["alcohol_units"] = alcohol

    sex = _map_sex(data.get("sex"))
    if sex is not None:
        patient["sex"] = sex

    se_asian = _map_se_asian(data.get("ethnicity"))
    if se_asian is not None:
        patient["se_asian"] = se_asian

    smoker = _map_smoker(data.get("smokingStatus"))
    if smoker is not None:
        patient["smoker"] = smoker

    binary_map = {
        "psc": "primarySclerosingCholangitis",
        "liver_fluke": "liverFlukeExposure",
        "hbv": "hepatitisB",
        "hcv": "hepatitisC",
        "cirrhosis": "liverDisease",
        "gallstones": "gallstones",
        "t2dm": "diabetes",
        "fam_bileduct": "familyHistoryBileDuctCancer",
    }
    for ml_key, api_key in binary_map.items():
        mapped = _as_bool01(data.get(api_key))
        if mapped is not None:
            patient[ml_key] = mapped

    # Optional labs (not on the risk form today; used when present)
    lab_map = {
        "alp": "alp",
        "ggt": "ggt",
        "alt": "alt",
        "ast": "ast",
        "albumin": "albumin",
        "bilirubin": ("bilirubinTotal", "bilirubin"),
        "ca19_9": ("ca199", "ca19_9", "ca19-9"),
    }
    for ml_key, sources in lab_map.items():
        keys = sources if isinstance(sources, tuple) else (sources,)
        value = None
        for key in keys:
            value = _as_float(data.get(key))
            if value is not None:
                break
        if value is not None:
            patient[ml_key] = value

    return patient

"""Medical report analysis using Gemini."""

from .gemini_service import GeminiService


class ReportService:
    """Handles report analysis requests."""

    def __init__(self):
        self.gemini = GeminiService()

    def process(self, data: dict | None = None) -> dict:
        data = data or {}

        report_text = data.get("reportText", "")
        report_type = data.get("reportType", "medical report")

        prompt = f"""
You are an expert hepatobiliary oncologist.

Analyze the following {report_type}.

Report:
{report_text}

Return a detailed HTML report containing:

1. Summary

2. Important Findings

3. Abnormal Values

4. Clinical Interpretation

5. Cholangiocarcinoma Relevance

6. Recommendations

Return valid HTML only.
"""

        analysis = self.gemini.generate(prompt)

        return {
            "status": "success",
            "service": "report",
            "analysis": analysis,
        }
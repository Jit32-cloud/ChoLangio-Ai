"""Placeholder service for follow-up tracking."""


class FollowupService:
    """Handles follow-up tracking requests. Logic to be implemented."""

    def process(self, data: dict | None = None) -> dict:
        """Process a follow-up request. Returns a placeholder response."""
        return {
            "status": "success",
            "service": "followup",
            "analysis": (
                "<html><body>"
                "<h2>Cholangiocarcinoma Follow-Up Guide</h2>"
                "<p>Structured follow-up after diagnosis or treatment of cholangiocarcinoma "
                "helps detect recurrence early and manage treatment-related effects.</p>"
                "<h3>Typical Follow-Up Checklist</h3>"
                "<ol>"
                "<li>Schedule clinic visits as recommended by your oncology or surgical team "
                "(commonly every 3–6 months in the first 2 years).</li>"
                "<li>Complete surveillance imaging (CT or MRI) when ordered.</li>"
                "<li>Review laboratory tests, including liver function tests and CA 19-9 "
                "when clinically appropriate.</li>"
                "<li>Report new jaundice, fever, ascending cholangitis symptoms, severe "
                "abdominal pain, or unintentional weight loss promptly.</li>"
                "<li>Track medications, stent exchanges (if applicable), and nutritional status.</li>"
                "</ol>"
                "<p>This guide is educational and should be adapted to your individualized "
                "care plan.</p>"
                "</body></html>"
            ),
        }

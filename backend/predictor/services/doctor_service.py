"""Placeholder service for doctor visit preparation."""


class DoctorService:
    """Handles doctor preparation requests. Logic to be implemented."""

    def process(self, data: dict | None = None) -> dict:
        """Process a doctor preparation request. Returns a placeholder response."""
        return {
            "status": "success",
            "service": "doctor",
            "analysis": (
                "<html><body>"
                "<h2>Preparing for Your Cholangiocarcinoma Doctor Visit</h2>"
                "<p>Bring organized information so your hepatobiliary or oncology team can "
                "review your case efficiently and address your priorities.</p>"
                "<h3>Questions to Consider Asking</h3>"
                "<ul>"
                "<li>What subtype and stage of cholangiocarcinoma do I have "
                "(intrahepatic, perihilar, or distal)?</li>"
                "<li>Is my tumor resectable, or is systemic therapy the primary approach?</li>"
                "<li>What do my latest imaging and CA 19-9 results mean?</li>"
                "<li>Do I need biliary drainage or stent management?</li>"
                "<li>What clinical trials or second opinions are appropriate for me?</li>"
                "<li>How should side effects, nutrition, and pain be managed?</li>"
                "</ul>"
                "<h3>Bring With You</h3>"
                "<ul>"
                "<li>Recent imaging CDs/reports and pathology results</li>"
                "<li>Current medication and allergy list</li>"
                "<li>Symptom diary and prior treatment history</li>"
                "</ul>"
                "</body></html>"
            ),
        }

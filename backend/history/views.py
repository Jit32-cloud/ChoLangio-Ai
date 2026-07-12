from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def health_check(request):
    """Placeholder endpoint for the history app."""
    return Response({"status": "ok", "app": "history"})

"""URL routing for the predictor app."""

from django.urls import path

from . import views

app_name = "predictor"

urlpatterns = [
    path("health/", views.health_check, name="health"),
    path("symptoms/", views.SymptomsView.as_view(), name="symptoms"),
    path("chat/", views.ChatView.as_view(), name="chat"),
    path("prediction/", views.PredictionView.as_view(), name="prediction"),
    path("gemini/", views.GeminiView.as_view(), name="gemini"),
    path("report/", views.ReportView.as_view(), name="report"),
    path("lab/", views.LabView.as_view(), name="lab"),
    path("imaging/", views.ImagingView.as_view(), name="imaging"),
    path("education/", views.EducationView.as_view(), name="education"),
    path("doctor/", views.DoctorView.as_view(), name="doctor"),
    path("healthplan/", views.HealthPlanView.as_view(), name="healthplan"),
    path("followup/", views.FollowupView.as_view(), name="followup"),
    path("risk/", views.RiskView.as_view(), name="risk"),
]

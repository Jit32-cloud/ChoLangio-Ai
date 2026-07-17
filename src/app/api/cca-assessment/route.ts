import { NextRequest, NextResponse } from "next/server";
import { DJANGO_PATHS, forwardToDjango } from "@/lib/django-client";
// Phase 4: restore Gemini
// import { callAI, PROMPTS } from "@/lib/ai-client";

/** Shape returned by Django POST /api/predictor/risk/ */
interface DjangoRiskResponse {
  status: string;
  service?: string;
  probability: number;
  risk_band: string;
  model: string;
  all_models?: Record<string, number>;
  model_agreement: string;
  explanation: Array<{
    feature?: string;
    label?: string;
    value?: number | null;
    shap?: number | null;
  }>;
  features_used: Record<string, unknown>;
  analysis: string;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const django = await forwardToDjango<DjangoRiskResponse>(
      DJANGO_PATHS.risk,
      data,
    );

    // Pass through the real ML prediction — do not wrap with placeholder text.
    return NextResponse.json({
      success: true,
      status: django.status,
      service: django.service,
      probability: django.probability,
      risk_band: django.risk_band,
      model: django.model,
      all_models: django.all_models,
      model_agreement: django.model_agreement,
      explanation: django.explanation,
      features_used: django.features_used,
      analysis: django.analysis,
      timestamp: new Date().toISOString(),
    });
    // Phase 4: restore Gemini
    // const response = await callAI(
    //   [{ role: "user", content: PROMPTS.ccaRiskAssessment(data) }],
    //   { maxTokens: 3000 }
    // )
    // return NextResponse.json({
    //   success: true,
    //   analysis: response.text,
    //   timestamp: new Date().toISOString(),
    // })
  } catch (e) {
    console.error("CCA ERROR:", e);
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : "CCA assessment failed",
      },
      { status: 500 },
    );
  }
}

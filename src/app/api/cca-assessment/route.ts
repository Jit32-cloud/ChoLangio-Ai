
import { NextRequest, NextResponse } from "next/server";
import { DJANGO_PATHS, forwardToDjango, placeholderText } from "@/lib/django-client";
// Phase 4: restore Gemini
// import { callAI, PROMPTS } from "@/lib/ai-client";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const django = await forwardToDjango(DJANGO_PATHS.risk, data)
    return NextResponse.json({
      success: true,
      analysis: placeholderText(django),
      timestamp: new Date().toISOString(),
    })
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
    console.error("CCA ERROR:", e)
    return NextResponse.json(
      { error: "CCA assessment failed" },
      { status: 500 }
    )
  }
}

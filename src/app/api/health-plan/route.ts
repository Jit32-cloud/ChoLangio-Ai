import { NextRequest, NextResponse } from "next/server"
import { DJANGO_PATHS, forwardToDjango, placeholderText } from "@/lib/django-client"
// Phase 4: restore Gemini
// import { callAI, PROMPTS } from "@/lib/ai-client"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const django = await forwardToDjango(DJANGO_PATHS.healthplan, data)
    return NextResponse.json({
      success: true,
      plan: placeholderText(django),
      timestamp: new Date().toISOString(),
    })
    // Phase 4: restore Gemini
    // const response = await callAI([{ role: "user", content: PROMPTS.healthImprovementPlan(data) }], { maxTokens: 2500 })
    // return NextResponse.json({ success: true, plan: response.text, timestamp: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json({ error: "Health plan generation failed" }, { status: 500 })
  }
}

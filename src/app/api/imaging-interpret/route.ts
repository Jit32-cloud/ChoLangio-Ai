import { NextRequest, NextResponse } from "next/server"
import { DJANGO_PATHS, forwardToDjango, placeholderText } from "@/lib/django-client"
// Phase 4: restore Gemini
// import { callAI, PROMPTS } from "@/lib/ai-client"

export async function POST(req: NextRequest) {
  try {
    const { text, modality = "imaging" } = await req.json()
    if (!text?.trim()) return NextResponse.json({ error: "Report text required" }, { status: 400 })
    const django = await forwardToDjango(DJANGO_PATHS.imaging, { text, modality })
    return NextResponse.json({
      success: true,
      interpretation: placeholderText(django),
      timestamp: new Date().toISOString(),
    })
    // Phase 4: restore Gemini
    // const response = await callAI([{ role: "user", content: PROMPTS.imagingInterpretation(text, modality) }], { maxTokens: 2000 })
    // return NextResponse.json({ success: true, interpretation: response.text, timestamp: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json({ error: "Imaging interpretation failed" }, { status: 500 })
  }
}

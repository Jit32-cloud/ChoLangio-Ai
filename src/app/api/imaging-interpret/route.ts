import { NextRequest, NextResponse } from "next/server"
import { callAI, PROMPTS } from "@/lib/ai-client"
export async function POST(req: NextRequest) {
  try {
    const { text, modality = "imaging" } = await req.json()
    if (!text?.trim()) return NextResponse.json({ error: "Report text required" }, { status: 400 })
    const response = await callAI([{ role: "user", content: PROMPTS.imagingInterpretation(text, modality) }], { maxTokens: 2000 })
    return NextResponse.json({ success: true, interpretation: response.text, timestamp: new Date().toISOString() })
  } catch (e) { return NextResponse.json({ error: "Imaging interpretation failed" }, { status: 500 }) }
}
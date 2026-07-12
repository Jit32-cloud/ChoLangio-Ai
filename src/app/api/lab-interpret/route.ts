import { NextRequest, NextResponse } from "next/server"
import { callAI, PROMPTS } from "@/lib/ai-client"
export async function POST(req: NextRequest) {
  try {
    const labs = await req.json()
    const response = await callAI([{ role: "user", content: PROMPTS.labInterpretation(labs) }], { maxTokens: 2000 })
    return NextResponse.json({ success: true, interpretation: response.text, timestamp: new Date().toISOString() })
  } catch (e) { return NextResponse.json({ error: "Lab interpretation failed" }, { status: 500 }) }
}
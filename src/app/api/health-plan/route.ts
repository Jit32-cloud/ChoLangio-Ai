import { NextRequest, NextResponse } from "next/server"
import { callAI, PROMPTS } from "@/lib/ai-client"
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const response = await callAI([{ role: "user", content: PROMPTS.healthImprovementPlan(data) }], { maxTokens: 2500 })
    return NextResponse.json({ success: true, plan: response.text, timestamp: new Date().toISOString() })
  } catch (e) { return NextResponse.json({ error: "Health plan generation failed" }, { status: 500 }) }
}
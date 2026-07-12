
import { NextRequest, NextResponse } from "next/server";
import { callAI, PROMPTS } from "@/lib/ai-client";



export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    console.log("CCA DATA RECEIVED:", data)

    const response = await callAI(
      [
        {
          role: "user",
          content: PROMPTS.ccaRiskAssessment(data),
        },
      ],
      { maxTokens: 3000 }
    )

    console.log("GEMINI RESPONSE:", response)

    return NextResponse.json({
      success: true,
      analysis: response.text,
      timestamp: new Date().toISOString(),
    })
  } catch (e) {
    console.error("CCA ERROR:", e)

    return NextResponse.json(
      { error: "CCA assessment failed" },
      { status: 500 }
    )
  }
}

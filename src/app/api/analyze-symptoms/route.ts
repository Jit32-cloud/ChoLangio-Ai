import { NextRequest, NextResponse } from 'next/server'
import { callAI, PROMPTS } from '@/lib/ai-client'

export async function POST(req: NextRequest) {
  try {
    const symptoms = await req.json()
    const response = await callAI([{ role: 'user', content: PROMPTS.symptomAssessment(symptoms) }], { maxTokens: 1800 })
    return NextResponse.json({ success: true, analysis: response.text, timestamp: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json({ error: 'Symptom assessment failed' }, { status: 500 })
  }
}

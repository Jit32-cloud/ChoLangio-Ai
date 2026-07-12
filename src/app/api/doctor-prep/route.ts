import { NextRequest, NextResponse } from 'next/server'
import { callAI, PROMPTS } from '@/lib/ai-client'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const response = await callAI([{ role: 'user', content: PROMPTS.doctorPreparation(data) }], { maxTokens: 2000 })
    return NextResponse.json({ success: true, preparation: response.text, timestamp: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json({ error: 'Doctor prep failed' }, { status: 500 })
  }
}

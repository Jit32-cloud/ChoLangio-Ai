import { NextRequest, NextResponse } from 'next/server'
import { callAI, PROMPTS } from '@/lib/ai-client'

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json()
    if (!topic) return NextResponse.json({ error: 'Topic required' }, { status: 400 })
    const response = await callAI([{ role: 'user', content: PROMPTS.educationContent(topic) }], { maxTokens: 2500 })
    return NextResponse.json({ success: true, content: response.text, timestamp: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json({ error: 'Education content failed' }, { status: 500 })
  }
}

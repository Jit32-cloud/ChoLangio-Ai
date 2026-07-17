import { NextRequest, NextResponse } from 'next/server'
import { DJANGO_PATHS, forwardToDjango, placeholderText } from '@/lib/django-client'
// Phase 4: restore Gemini
// import { callAI, PROMPTS } from '@/lib/ai-client'

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json()
    if (!topic) return NextResponse.json({ error: 'Topic required' }, { status: 400 })
    const django = await forwardToDjango(DJANGO_PATHS.education, { topic })
    return NextResponse.json({
      success: true,
      content: django.analysis,
      timestamp: new Date().toISOString(),
    })
    // Phase 4: restore Gemini
    // const response = await callAI([{ role: 'user', content: PROMPTS.educationContent(topic) }], { maxTokens: 2500 })
    // return NextResponse.json({ success: true, content: response.text, timestamp: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json({ error: 'Education content failed' }, { status: 500 })
  }
}

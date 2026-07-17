import { NextRequest, NextResponse } from 'next/server'
import { DJANGO_PATHS, forwardToDjango, placeholderText } from '@/lib/django-client'
// Phase 4: restore Gemini
// import { callAI, PROMPTS } from '@/lib/ai-client'

export async function POST(req: NextRequest) {
  try {
    const { context } = await req.json()
    if (!context?.trim()) return NextResponse.json({ error: 'Patient context required' }, { status: 400 })
    const django = await forwardToDjango(DJANGO_PATHS.followup, { context })
    return NextResponse.json({
      success: true,
      plan: django.analysis,
      timestamp: new Date().toISOString(),
    })
    // Phase 4: restore Gemini
    // const response = await callAI(
    //   [{ role: 'user', content: PROMPTS.followupPlan(context) }],
    //   { maxTokens: 2000 }
    // )
    // return NextResponse.json({ success: true, plan: response.text, timestamp: new Date().toISOString() })
  } catch {
    return NextResponse.json({ error: 'Follow-up plan generation failed' }, { status: 500 })
  }
}

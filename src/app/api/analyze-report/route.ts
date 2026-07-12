import { NextRequest, NextResponse } from 'next/server'
import { DJANGO_PATHS, forwardToDjango, placeholderText } from '@/lib/django-client'
// Phase 4: restore Gemini
// import { callAI, PROMPTS } from '@/lib/ai-client'

export async function POST(req: NextRequest) {
  try {
    const { reportText, reportType = 'medical report' } = await req.json()
    if (!reportText?.trim()) return NextResponse.json({ error: 'Report text required' }, { status: 400 })
    const django = await forwardToDjango(DJANGO_PATHS.report, { reportText, reportType })
    return NextResponse.json({
      success: true,
      analysis: placeholderText(django),
      timestamp: new Date().toISOString(),
    })
    // Phase 4: restore Gemini
    // const response = await callAI([{ role: 'user', content: PROMPTS.reportAnalysis(reportText, reportType) }], { maxTokens: 2000 })
    // return NextResponse.json({ success: true, analysis: response.text, timestamp: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json({ error: 'Report analysis failed' }, { status: 500 })
  }
}

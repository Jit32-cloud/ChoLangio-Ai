import { NextResponse } from 'next/server'
import { DJANGO_PATHS, forwardToDjango } from '@/lib/django-client'

export async function GET() {
  try {
    const django = await forwardToDjango(DJANGO_PATHS.health, undefined, { method: 'GET' })
    return NextResponse.json({
      ...django,
      status: 'healthy',
      version: '2.0.0',
      platform: 'CholangioAI',
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ status: 'healthy', version: '2.0.0', platform: 'CholangioAI', timestamp: new Date().toISOString() })
  }
}

const DJANGO_BASE = process.env.DJANGO_API_URL || 'http://127.0.0.1:8000'

export const DJANGO_PATHS = {
  symptoms: '/api/predictor/symptoms/',
  risk: '/api/predictor/risk/',
  report: '/api/predictor/report/',
  lab: '/api/predictor/lab/',
  imaging: '/api/predictor/imaging/',
  followup: '/api/predictor/followup/',
  education: '/api/predictor/education/',
  doctor: '/api/predictor/doctor/',
  chat: '/api/predictor/chat/',
  healthplan: '/api/predictor/healthplan/',
  health: '/api/predictor/health/',
} as const

export interface DjangoPlaceholder {
  status: string
  service?: string
  app?: string
}

export function placeholderText(django: DjangoPlaceholder): string {
  const label = django.service ?? django.app ?? 'service'
  return `[Placeholder] ${label} backend is ready (${django.status}).`
}

export async function forwardToDjango<T = DjangoPlaceholder>(
  path: string,
  body?: unknown,
  options?: { method?: string },
): Promise<T> {
  const method = options?.method ?? 'POST'
  const res = await fetch(`${DJANGO_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const detail =
      typeof err === 'object' && err !== null && 'detail' in err
        ? String((err as { detail: unknown }).detail)
        : `Django request failed: ${res.status}`
    throw new Error(detail)
  }

  return res.json() as Promise<T>
}

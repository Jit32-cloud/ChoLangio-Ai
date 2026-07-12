import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))
}

export function formatRelative(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

export function getRiskColor(score: number): string {
  if (score <= 20) return 'text-green-400'
  if (score <= 40) return 'text-emerald-400'
  if (score <= 60) return 'text-yellow-400'
  if (score <= 80) return 'text-orange-400'
  return 'text-red-400'
}

export function getRiskCategory(score: number): string {
  if (score <= 20) return 'Safe Zone'
  if (score <= 40) return 'Low Risk'
  if (score <= 60) return 'Moderate Risk'
  if (score <= 80) return 'High Risk'
  return 'Very High Risk'
}

export function getRiskBadgeClass(score: number): string {
  if (score <= 20) return 'bg-green-900/40 text-green-400 border border-green-800'
  if (score <= 40) return 'bg-emerald-900/40 text-emerald-400 border border-emerald-800'
  if (score <= 60) return 'bg-yellow-900/40 text-yellow-400 border border-yellow-800'
  if (score <= 80) return 'bg-orange-900/40 text-orange-400 border border-orange-800'
  return 'bg-red-900/40 text-red-400 border border-red-800'
}

export function getRiskGaugeColor(score: number): string {
  if (score <= 20) return '#22c55e'
  if (score <= 40) return '#10b981'
  if (score <= 60) return '#eab308'
  if (score <= 80) return '#f97316'
  return '#ef4444'
}

export function labStatus(value: number, lo: number, hi: number): 'normal' | 'elevated' | 'critical' {
  if (value <= hi && value >= lo) return 'normal'
  if (value > hi * 2 || value < lo * 0.5) return 'critical'
  return 'elevated'
}

export function labStatusColor(status: 'normal' | 'elevated' | 'critical'): string {
  return status === 'normal' ? 'text-green-400' : status === 'elevated' ? 'text-yellow-400' : 'text-red-400'
}

export function labStatusBg(status: 'normal' | 'elevated' | 'critical'): string {
  return status === 'normal'
    ? 'bg-green-900/20 border-green-800/50'
    : status === 'elevated'
    ? 'bg-yellow-900/20 border-yellow-800/50'
    : 'bg-red-900/20 border-red-800/50'
}

export async function callAPI<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as Record<string,string>).error || `Request failed: ${res.status}`)
  }
  return res.json()
}

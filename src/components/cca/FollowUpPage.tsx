'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { CalendarPlus, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { AIOutput } from '@/components/ui/AIOutput'
import { AILoadingSkeleton } from '@/components/ui/Skeleton'
import { callAPI } from '@/lib/utils'

const ACTIONS = [
  { title: 'MRCP — Suresh Nair', sub: 'Overdue — should have been booked Jun 14', urgency: 'overdue', icon: AlertCircle },
  { title: 'Repeat CA 19-9 — Anita Singh', sub: 'Due: June 25, 2026', urgency: 'due-soon', icon: Clock },
  { title: 'Liver function recheck — Rajan Pillai', sub: 'Scheduled: July 1, 2026', urgency: 'scheduled', icon: CheckCircle2 },
]

const urgencyStyle: Record<string, string> = {
  overdue: 'bg-red-900/15 border-red-900/40 text-red-300',
  'due-soon': 'bg-yellow-900/15 border-yellow-900/40 text-yellow-300',
  scheduled: 'border-gray-800/60',
}

export function FollowUpPage() {
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function submit() {
    if (!context.trim()) { toast.error('Please describe the patient context'); return }
    setLoading(true); setResult(null)
    try {
      const data = await callAPI<{ plan: string }>('/api/follow-up', { context })
      setResult(data.plan)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Plan generation failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-200 mb-3">Pending Actions</h2>
        <div className="space-y-2">
          {ACTIONS.map((a, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${urgencyStyle[a.urgency]}`}>
              <div className="flex items-center gap-2.5">
                <a.icon className={`w-4 h-4 ${a.urgency === 'scheduled' ? 'text-green-400' : ''}`} />
                <div>
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-xs opacity-70">{a.sub}</div>
                </div>
              </div>
              {a.urgency !== 'scheduled' && <button className="btn-outline text-xs py-1">Action</button>}
              {a.urgency === 'scheduled' && <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-400">Scheduled</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2"><CalendarPlus className="w-4 h-4 text-medical-400" />Generate Follow-up Plan</h2>
        <textarea className="form-input min-h-[100px]"
          placeholder="E.g. 58M with PSC, CA19-9 trending down from 67 to 42, on lifestyle intervention, awaiting repeat MRCP..."
          value={context} onChange={e => setContext(e.target.value)} />
        <button className="btn-medical w-full justify-center mt-3" onClick={submit} disabled={loading}>
          {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</> : <><CalendarPlus className="w-4 h-4" /> Generate AI Follow-up Plan</>}
        </button>
      </div>

      {loading && <AILoadingSkeleton label="Building surveillance schedule..." />}
      {!loading && result && <AIOutput html={result} label="Follow-up Plan" timestamp={new Date().toLocaleTimeString()} />}
    </div>
  )
}

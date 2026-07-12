'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { NotebookPen } from 'lucide-react'
import { AIOutput } from '@/components/ui/AIOutput'
import { AILoadingSkeleton } from '@/components/ui/Skeleton'
import { callAPI } from '@/lib/utils'

const APPT_TYPES = [
  'Initial hepatobiliary consultation', 'Surgical oncology consultation', 'Tumor board review',
  'Chemotherapy discussion', 'Post-treatment follow-up', 'Second opinion', 'PSC surveillance visit',
]

export function DoctorPrepPage() {
  const [appointmentType, setAppointmentType] = useState(APPT_TYPES[0])
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function submit() {
    setLoading(true); setResult(null)
    try {
      const data = await callAPI<{ preparation: string }>('/api/doctor-prep', { appointmentType, context })
      setResult(data.preparation)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Generation failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2"><NotebookPen className="w-4 h-4 text-medical-400" />Consultation Preparation</h2>
        <div className="space-y-3">
          <div>
            <label className="form-label">Appointment type</label>
            <select className="form-input" value={appointmentType} onChange={e => setAppointmentType(e.target.value)}>
              {APPT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Patient summary / recent findings</label>
            <textarea className="form-input min-h-[120px]"
              placeholder="E.g. 58-year-old male, PSC diagnosed 2022, CA19-9 trending down 67→42, recent MRCP showed stable hilar stricture, wants to discuss surveillance interval and lifestyle..."
              value={context} onChange={e => setContext(e.target.value)} />
          </div>
        </div>
        <button className="btn-medical w-full justify-center mt-4" onClick={submit} disabled={loading}>
          {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</> : <><NotebookPen className="w-4 h-4" /> Generate Doctor Prep</>}
        </button>
      </div>

      {loading && <AILoadingSkeleton label="Preparing consultation guide..." />}
      {!loading && result && <AIOutput html={result} label="Doctor Preparation Guide" timestamp={new Date().toLocaleTimeString()} />}
    </div>
  )
}

'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Stethoscope } from 'lucide-react'
import { AIOutput } from '@/components/ui/AIOutput'
import { AILoadingSkeleton } from '@/components/ui/Skeleton'
import { callAPI } from '@/lib/utils'

const SYMPTOM_FIELDS = [
  { key: 'jaundice', label: 'Jaundice (yellow skin/eyes)' },
  { key: 'abdominalPain', label: 'Abdominal / RUQ pain' },
  { key: 'weightLoss', label: 'Unexplained weight loss' },
  { key: 'fatigue', label: 'Persistent fatigue' },
  { key: 'pruritus', label: 'Pruritus (itching)' },
  { key: 'darkUrine', label: 'Dark urine' },
  { key: 'paleStools', label: 'Pale / clay-coloured stools' },
  { key: 'fever', label: 'Fever / chills' },
  { key: 'nausea', label: 'Nausea / vomiting' },
  { key: 'lossOfAppetite', label: 'Loss of appetite' },
]

function SeveritySelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const opts = [
    { v: 0, label: 'None', cls: 'bg-gray-800 text-gray-500' },
    { v: 1, label: 'Mild', cls: 'bg-green-900/40 text-green-400' },
    { v: 2, label: 'Moderate', cls: 'bg-yellow-900/40 text-yellow-400' },
    { v: 3, label: 'Severe', cls: 'bg-red-900/40 text-red-400' },
  ]
  return (
    <div className="flex gap-1">
      {opts.map(o => (
        <button key={o.v} type="button" onClick={() => onChange(o.v)}
          className={`px-2 py-1 rounded text-xs font-medium border transition-all ${value === o.v ? o.cls + ' border-current' : 'border-gray-700 text-gray-600 hover:border-gray-600'}`}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState<Record<string, number>>(
    Object.fromEntries(SYMPTOM_FIELDS.map(s => [s.key, 0]))
  )
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const hasRedFlag = symptoms.jaundice > 0 || symptoms.paleStools > 0 || symptoms.darkUrine > 0
  const anySymptom = Object.values(symptoms).some(v => v > 0)

  async function submit() {
    if (!anySymptom && !notes.trim()) { toast.error('Please select at least one symptom or add notes'); return }
    setLoading(true); setResult(null)
    try {
      const data = await callAPI<{ analysis: string }>('/api/analyze-symptoms', { ...symptoms, duration, notes })
      setResult(data.analysis)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Analysis failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2"><Stethoscope className="w-4 h-4 text-medical-400" />Symptom Severity Assessment</h2>
        <div className="alert-info text-xs">Rate the severity of each symptom you are currently experiencing. Jaundice, weight loss, and pale stools together form the classic cholangiocarcinoma presentation.</div>

        <div className="space-y-3">
          {SYMPTOM_FIELDS.map(s => (
            <div key={s.key} className="flex items-center justify-between gap-4">
              <label className="text-sm text-gray-300 flex-1">{s.label}</label>
              <SeveritySelect value={symptoms[s.key]} onChange={v => setSymptoms(p => ({ ...p, [s.key]: v }))} />
            </div>
          ))}
        </div>

        {hasRedFlag && (
          <div className="alert-danger">
            <span className="font-semibold">⚠ Red flag:</span> Jaundice, pale stools, or dark urine indicate possible biliary obstruction. Urgent hepatobiliary evaluation is recommended.
          </div>
        )}

        <div>
          <label className="form-label">How long have symptoms been present?</label>
          <select className="form-input" value={duration} onChange={e => setDuration(e.target.value)}>
            <option value="">Select duration</option>
            <option value="<1 week">Less than 1 week</option>
            <option value="1-4 weeks">1–4 weeks</option>
            <option value="1-3 months">1–3 months</option>
            <option value="3-6 months">3–6 months</option>
            <option value=">6 months">More than 6 months</option>
          </select>
        </div>

        <div>
          <label className="form-label">Additional notes (optional)</label>
          <textarea className="form-input min-h-[80px]" placeholder="Any other relevant details — onset pattern, associated factors, prior diagnoses..."
            value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <button className="btn-medical w-full justify-center" onClick={submit} disabled={loading}>
          {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</> : <><Stethoscope className="w-4 h-4" /> Analyze Symptoms</>}
        </button>
      </div>

      {loading && <AILoadingSkeleton label="Assessing symptom pattern..." />}
      {!loading && result && <AIOutput html={result} label="Symptom Assessment" timestamp={new Date().toLocaleTimeString()} />}
    </div>
  )
}

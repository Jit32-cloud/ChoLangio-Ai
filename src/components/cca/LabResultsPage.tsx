'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { FlaskConical, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { AIOutput } from '@/components/ui/AIOutput'
import { AILoadingSkeleton } from '@/components/ui/Skeleton'
import { callAPI, labStatus, labStatusColor, labStatusBg } from '@/lib/utils'

const LABS = [
  { key: 'bilirubinTotal', label: 'Bilirubin (Total)', unit: 'mg/dL', lo: 0.2, hi: 1.2, note: 'Key marker of biliary obstruction' },
  { key: 'bilirubinDirect', label: 'Bilirubin (Direct)', unit: 'mg/dL', lo: 0, hi: 0.3, note: 'Elevated in cholestasis/obstruction' },
  { key: 'alp', label: 'ALP', unit: 'U/L', lo: 40, hi: 130, note: 'Cholestatic pattern marker' },
  { key: 'ggt', label: 'GGT', unit: 'U/L', lo: 8, hi: 61, note: 'Sensitive biliary disease marker' },
  { key: 'ast', label: 'AST', unit: 'U/L', lo: 10, hi: 40, note: 'Hepatocellular damage' },
  { key: 'alt', label: 'ALT', unit: 'U/L', lo: 7, hi: 56, note: 'Hepatocellular damage (more specific)' },
  { key: 'ca199', label: 'CA 19-9', unit: 'U/mL', lo: 0, hi: 37, note: 'Primary CCA tumor marker (Sn 79%)' },
  { key: 'albumin', label: 'Albumin', unit: 'g/dL', lo: 3.5, hi: 5.0, note: 'Liver synthetic function' },
  { key: 'inr', label: 'INR', unit: '', lo: 0.8, hi: 1.2, note: 'Coagulation / liver function' },
]

export function LabResultsPage() {
  const [labs, setLabs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [testedAt, setTestedAt] = useState(new Date().toISOString().slice(0, 10))

  const set = (k: string, v: string) => setLabs(p => ({ ...p, [k]: v }))

  const filledCount = Object.values(labs).filter(v => v !== '').length

  async function submit() {
    if (filledCount === 0) { toast.error('Enter at least one lab value'); return }
    setLoading(true); setResult(null)
    try {
      const payload: Record<string, unknown> = { testedAt }
      LABS.forEach(l => { if (labs[l.key]) payload[l.key] = parseFloat(labs[l.key]) })
      const data = await callAPI<{ interpretation: string }>('/api/lab-interpret', payload)
      setResult(data.interpretation)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Interpretation failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-medical-400" />Enter Lab Values</h2>
            <div className="text-xs text-gray-500">{filledCount} / {LABS.length} entered</div>
          </div>
          <div>
            <label className="form-label">Test date</label>
            <input type="date" className="form-input" value={testedAt} onChange={e => setTestedAt(e.target.value)} />
          </div>
          <div className="space-y-2.5">
            {LABS.map(l => {
              const val = labs[l.key] ? parseFloat(labs[l.key]) : null
              const status = val !== null ? labStatus(val, l.lo, l.hi) : null
              return (
                <div key={l.key}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="form-label mb-0">{l.label} {l.unit && <span className="text-gray-600">({l.unit})</span>}</label>
                    {status && (
                      <span className={`text-[10px] font-medium flex items-center gap-0.5 ${labStatusColor(status)}`}>
                        {status === 'normal' ? <Minus className="w-3 h-3" /> : status === 'elevated' ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 text-red-400" />}
                        {status.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className={`flex items-center gap-2 rounded-lg border p-2 transition-all ${status ? labStatusBg(status) : 'border-gray-700'}`}>
                    <input type="number" step="0.01" className="bg-transparent flex-1 text-sm text-gray-100 focus:outline-none placeholder-gray-600"
                      placeholder={`Ref: ${l.lo}–${l.hi}`} value={labs[l.key] || ''}
                      onChange={e => set(l.key, e.target.value)} />
                    <span className="text-xs text-gray-500 shrink-0">{l.unit}</span>
                  </div>
                  {val !== null && status !== 'normal' && (
                    <div className="text-[10px] text-gray-500 mt-0.5">{l.note}</div>
                  )}
                  {l.key === 'ca199' && val !== null && val > 37 && (
                    <div className="text-[10px] text-yellow-500 mt-0.5">
                      Note: CA 19-9 can be falsely elevated in cholangitis, IBD, pancreatitis. Interpret in clinical context.
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <button className="btn-medical w-full justify-center" onClick={submit} disabled={loading || filledCount === 0}>
            {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Interpreting...</> : <><FlaskConical className="w-4 h-4" /> Interpret Results</>}
          </button>
        </div>

        {/* Reference panel */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-200 mb-3">CCA Biomarker Reference</h2>
          <div className="space-y-2">
            {LABS.map(l => {
              const val = labs[l.key] ? parseFloat(labs[l.key]) : null
              const status = val !== null ? labStatus(val, l.lo, l.hi) : 'normal'
              return (
                <div key={l.key} className={`rounded-lg border p-2.5 transition-all ${val !== null ? labStatusBg(status) : 'border-gray-800/50'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-300">{l.label}</span>
                    <span className="text-xs text-gray-500">Ref: {l.lo}–{l.hi} {l.unit}</span>
                  </div>
                  {val !== null && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-lg font-semibold ${labStatusColor(status)}`}>{val}</span>
                      <span className="text-xs text-gray-500">{l.unit}</span>
                      {status !== 'normal' && (
                        <span className={`text-xs ml-auto ${labStatusColor(status)}`}>
                          {status === 'elevated' ? `↑ ${((val / l.hi - 1) * 100).toFixed(0)}% above ULN` : '‼ Critically abnormal'}
                        </span>
                      )}
                    </div>
                  )}
                  {!val && <div className="text-xs text-gray-600 mt-0.5">{l.note}</div>}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {loading && <AILoadingSkeleton label="Interpreting CCA biomarkers..." />}
      {!loading && result && <AIOutput html={result} label="Lab Interpretation — CCA Focus" timestamp={testedAt} />}
    </div>
  )
}

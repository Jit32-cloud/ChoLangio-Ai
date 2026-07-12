'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { FileText, Upload } from 'lucide-react'
import { AIOutput } from '@/components/ui/AIOutput'
import { AILoadingSkeleton } from '@/components/ui/Skeleton'
import { callAPI } from '@/lib/utils'

const TYPES = ['Lab Report', 'Discharge Summary', 'Clinical Notes', 'Referral Letter', 'Pathology Report', 'Other']

export function ReportAnalyzerPage() {
  const [reportType, setReportType] = useState('Lab Report')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = () => setText(reader.result as string)
      reader.readAsText(file)
    } else {
      toast.info(`File "${file.name}" selected — PDF/DOCX text extraction runs server-side in production. Paste text below for now.`)
    }
  }

  async function submit() {
    if (!text.trim()) { toast.error('Please paste or upload report text'); return }
    setLoading(true); setResult(null)
    try {
      const data = await callAPI<{ analysis: string }>('/api/analyze-report', { reportText: text, reportType })
      setResult(data.analysis)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Analysis failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">Report type</label>
            <select className="form-input" value={reportType} onChange={e => setReportType(e.target.value)}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <label className="btn-outline w-full justify-center cursor-pointer">
              <Upload className="w-4 h-4" /> Upload .txt file
              <input type="file" accept=".txt,.pdf,.docx" className="hidden" onChange={handleFile} />
            </label>
          </div>
        </div>

        <div>
          <label className="form-label">Report content</label>
          <textarea className="form-input min-h-[220px] font-mono text-xs"
            placeholder="Paste medical report text here for AI extraction and CCA-relevant interpretation..."
            value={text} onChange={e => setText(e.target.value)} />
        </div>

        <button className="btn-medical w-full justify-center mt-4" onClick={submit} disabled={loading || !text.trim()}>
          {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</> : <><FileText className="w-4 h-4" /> Analyze Report</>}
        </button>
      </div>

      {loading && <AILoadingSkeleton label="Extracting clinical findings..." />}
      {!loading && result && <AIOutput html={result} label="Report Analysis" timestamp={new Date().toLocaleTimeString()} />}
    </div>
  )
}

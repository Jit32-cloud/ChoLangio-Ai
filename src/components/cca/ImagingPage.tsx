'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Scan, Upload, FileText } from 'lucide-react'
import { AIOutput } from '@/components/ui/AIOutput'
import { AILoadingSkeleton } from '@/components/ui/Skeleton'
import { callAPI } from '@/lib/utils'

const MODALITIES = ['MRCP', 'CT Abdomen (Triple Phase)', 'MRI Liver', 'Ultrasound Abdomen', 'PET-CT', 'ERCP', 'Endoscopic Ultrasound (EUS)']

const SAMPLE = `MRCP Report:
Clinical indication: Obstructive jaundice, elevated CA 19-9 (67 U/mL). Query bile duct malignancy.
Technique: 3T MRCP with T2 HASTE and 3D MRCP sequences.
Findings: There is an ill-defined stricture at the hepatic hilum with involvement of both the left and right hepatic ducts for approximately 1.5 cm. Bilateral upstream intrahepatic biliary duct dilatation (right > left). The common bile duct distal to the confluence appears normal calibre. The gallbladder is moderately distended without gallstones. No hepatic parenchymal mass lesion identified. No ascites.
Impression: Hilar biliary stricture with bilateral intrahepatic ductal dilatation. Findings most consistent with Bismuth-Corlette Type III hilar cholangiocarcinoma (Klatskin tumour). ERCP with brushings and CT triple-phase recommended for further characterisation.`

export function ImagingPage() {
  const [modality, setModality] = useState('MRCP')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function submit() {
    if (!text.trim()) { toast.error('Please enter imaging report text'); return }
    setLoading(true); setResult(null)
    try {
      const data = await callAPI<{ interpretation: string }>('/api/imaging-interpret', { text, modality })
      setResult(data.interpretation)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Interpretation failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="card">
        <div className="alert-info mb-4">
          <Scan className="w-4 h-4 shrink-0" />
          <span>Paste your radiology report text for AI interpretation focused on cholangiocarcinoma findings, Bismuth-Corlette classification, resectability assessment, and next steps.</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">Imaging modality</label>
            <select className="form-input" value={modality} onChange={e => setModality(e.target.value)}>
              {MODALITIES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn-outline w-full justify-center" onClick={() => setText(SAMPLE)}>
              <FileText className="w-4 h-4" /> Load sample MRCP report
            </button>
          </div>
        </div>

        <div>
          <label className="form-label">Radiology / imaging report text</label>
          <textarea className="form-input min-h-[200px] font-mono text-xs"
            placeholder={`Paste ${modality} report text here...\n\nExample: MRCP shows hilar stricture involving bilateral hepatic ducts...`}
            value={text} onChange={e => setText(e.target.value)} />
        </div>

        <button className="btn-medical w-full justify-center mt-4" onClick={submit} disabled={loading || !text.trim()}>
          {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Interpreting...</> : <><Scan className="w-4 h-4" /> Interpret {modality} Report</>}
        </button>
      </div>

      {/* Bismuth-Corlette reference */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-200 mb-3">Bismuth-Corlette Classification Reference</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { type: 'Type I', desc: 'Stricture below hepatic duct confluence', res: 'Often resectable', color: 'text-green-400 bg-green-900/20 border-green-900/40' },
            { type: 'Type II', desc: 'Reaches confluence, both ducts involved', res: 'Resectable', color: 'text-emerald-400 bg-emerald-900/20 border-emerald-900/40' },
            { type: 'Type IIIa/b', desc: 'Extends into R or L hepatic duct', res: 'Technically demanding', color: 'text-yellow-400 bg-yellow-900/20 border-yellow-900/40' },
            { type: 'Type IV', desc: 'Both hepatic ducts involved', res: 'Often unresectable', color: 'text-red-400 bg-red-900/20 border-red-900/40' },
          ].map(b => (
            <div key={b.type} className={`rounded-lg border p-3 ${b.color}`}>
              <div className="text-sm font-semibold mb-1">{b.type}</div>
              <div className="text-xs opacity-80 mb-1">{b.desc}</div>
              <div className="text-[10px] font-medium">{b.res}</div>
            </div>
          ))}
        </div>
      </div>

      {loading && <AILoadingSkeleton label="Interpreting imaging findings..." />}
      {!loading && result && <AIOutput html={result} label={`${modality} Interpretation — CCA Focus`} timestamp={new Date().toLocaleTimeString()} />}
    </div>
  )
}

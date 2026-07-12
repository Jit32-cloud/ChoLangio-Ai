'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { BookOpen, FlaskConical, Scan, Stethoscope, Apple, Pill, Shield, HeartPulse } from 'lucide-react'
import { AIOutput } from '@/components/ui/AIOutput'
import { AILoadingSkeleton } from '@/components/ui/Skeleton'
import { callAPI } from '@/lib/utils'

const TOPICS = [
  { key: 'Cholangiocarcinoma overview and epidemiology', label: 'CCA Overview', icon: BookOpen, color: 'text-medical-400 bg-medical-400/10 border-medical-400/20' },
  { key: 'Risk factors for cholangiocarcinoma including PSC and liver fluke', label: 'Risk Factors', icon: Shield, color: 'text-orange-400 bg-orange-900/15 border-orange-900/30' },
  { key: 'CA 19-9 and tumor marker interpretation for biliary cancers', label: 'Tumor Markers', icon: FlaskConical, color: 'text-yellow-400 bg-yellow-900/15 border-yellow-900/30' },
  { key: 'Imaging diagnosis of cholangiocarcinoma — MRCP, CT, Bismuth-Corlette', label: 'Imaging & Staging', icon: Scan, color: 'text-blue-400 bg-blue-900/15 border-blue-900/30' },
  { key: 'Treatment options for cholangiocarcinoma — surgery, chemotherapy, targeted therapy', label: 'Treatment Options', icon: Pill, color: 'text-purple-400 bg-purple-900/15 border-purple-900/30' },
  { key: 'Symptoms and early warning signs of bile duct cancer', label: 'Symptoms', icon: Stethoscope, color: 'text-red-400 bg-red-900/15 border-red-900/30' },
  { key: 'Diet and nutrition for liver and biliary health', label: 'Nutrition & Liver Health', icon: Apple, color: 'text-green-400 bg-green-900/15 border-green-900/30' },
  { key: 'Primary Sclerosing Cholangitis and its relationship to bile duct cancer', label: 'PSC & Surveillance', icon: HeartPulse, color: 'text-pink-400 bg-pink-900/15 border-pink-900/30' },
]

export function EducationPage() {
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)

  async function load(topic: string, label: string) {
    setLoading(true); setResult(null); setActive(label)
    try {
      const data = await callAPI<{ content: string }>('/api/education', { topic })
      setResult(data.content)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load content')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TOPICS.map(t => (
          <button key={t.label} onClick={() => load(t.key, t.label)}
            className={`card-sm border text-left transition-all hover:scale-[1.02] ${t.color} ${active === t.label ? 'ring-1 ring-current' : ''}`}>
            <t.icon className="w-5 h-5 mb-2" />
            <div className="text-xs font-medium text-gray-200">{t.label}</div>
          </button>
        ))}
      </div>

      {loading && <AILoadingSkeleton label={`Loading ${active}...`} />}
      {!loading && result && <AIOutput html={result} label={active || 'Education Content'} disclaimer={false} />}
      {!loading && !result && (
        <div className="card h-48 flex flex-col items-center justify-center text-center">
          <BookOpen className="w-8 h-8 text-gray-600 mb-2" />
          <p className="text-sm text-gray-500">Select a topic above to load evidence-based educational content</p>
        </div>
      )}
    </div>
  )
}

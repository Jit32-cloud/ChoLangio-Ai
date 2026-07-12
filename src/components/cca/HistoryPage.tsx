'use client'
import { TrendingDown, TrendingUp, Calendar, FlaskConical, Scan, Stethoscope, Pill } from 'lucide-react'
import { getRiskGaugeColor, getRiskBadgeClass, getRiskCategory } from '@/lib/utils'
import { useState,useEffect } from 'react'


function Sparkline({ data }: { data: { date: string; score: number }[] }) {
  const w = 600, h = 140, pad = 24
  const max = 100, min = 0

  if (data.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center text-gray-500 text-sm">
        No assessment history available
      </div>
    )
  }



  const benchmarkScore = 20

  const benchmarkY =
    pad +
    (1 - benchmarkScore / 100) *
      (h - pad * 2)

  const stepX =
    data.length === 1
      ? 0
      : (w - pad * 2) /
        (data.length - 1)


  const points = data.map((d, i) => {
    const x = pad + i * stepX
    const y = pad + (1 - (d.score - min) / (max - min)) * (h - pad * 2)
    return { x, y, ...d }
  })
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${path} L ${points[points.length - 1].x} ${h - pad} L ${points[0].x} ${h - pad} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-36">
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1D9E75" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1D9E75" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map(v => {
        const y = pad + (1 - v / 100) * (h - pad * 2)
        return <line key={v} x1={pad} y1={y} x2={w - pad} y2={y} stroke="#1f2937" strokeWidth="1" />
      })}
      <line
  x1={pad}
  y1={benchmarkY}
  x2={w - pad}
  y2={benchmarkY}
  stroke="#22c55e"
  strokeWidth="2"
  strokeDasharray="6 4"
/>

<text
  x={w - pad}
  y={benchmarkY - 6}
  textAnchor="end"
  fontSize="10"
  fill="#22c55e"
>
  Healthy Benchmark
</text>

<path d={areaPath} fill="url(#trendGrad)" />

<path
  d={path}
  fill="none"
  stroke="#1D9E75"
  strokeWidth="2.5"
  strokeLinecap="round"
  strokeLinejoin="round"
/>

{data.length === 1 && (
  <line
    x1={points[0].x}
    y1={points[0].y}
    x2={points[0].x}
    y2={benchmarkY}
    stroke="#f59e0b"
    strokeWidth="2"
  />
)}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill={getRiskGaugeColor(p.score)} stroke="#0a0f1e" strokeWidth="2" />
          <text x={p.x} y={h - 4} textAnchor="middle" fontSize="9" fill="#6b7280">{p.date.split(' ')[0]}</text>
        </g>
      ))}
    </svg>
  )
}

interface PatientData {
  patientName: string
  age: number
  sex: string
  riskScore: number
  date: string
}

export function HistoryPage() {





  const [latestPatient, setLatestPatient] =
  useState<PatientData | null>(null)
  const [trend, setTrend] = useState<
  { date: string; score: number }[]
>([])

useEffect(() => {
  const patient = JSON.parse(
    localStorage.getItem("latestPatient") || "null"
  )

  const history = JSON.parse(
    localStorage.getItem("riskHistory") || "[]"
  )

  setLatestPatient(patient)

  setTrend(
    history.map((item: any) => ({
      date: item.date,
      score: item.riskScore
    }))
  )
}, [])

const timeline =
  latestPatient
    ? [
        {
          icon: Stethoscope,
          color:
            'text-red-400 bg-red-900/20 border-red-900/40',
          title: 'Risk Assessment Completed',
          desc: `Risk Score: ${latestPatient?.riskScore ?? 0}`,
          date: latestPatient?.date ?? ''
        }
      ]
    : []

  const latest =
  trend.length > 0
    ? trend[trend.length - 1].score
    : 0

    const healthyBenchmark = 20

const healthGap =
  latest > 0
    ? latest - healthyBenchmark
    : 0

const first =
  trend.length > 0
    ? trend[0].score
    : 0

  const improved =
  trend.length > 1
    ? latest < first
    : false

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Patient header */}
      <div className="card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-medical-400/15 border border-medical-400/30 flex items-center justify-center text-medical-400 font-semibold">{
  latestPatient?.patientName
    ? latestPatient.patientName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'NP'
}</div>
          <div>
            <div className="text-sm font-semibold text-gray-100">
  {latestPatient
    ? `${latestPatient.patientName}, ${latestPatient.age}${latestPatient.sex === 'male' ? 'M' : 'F'}`
    : 'No Patient Data'}
</div>

<div className="text-xs text-gray-500">
  {trend.length > 0
    ? `Tracking ${trend.length} assessment(s)`
    : 'No assessments yet'}
</div>
           
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${getRiskBadgeClass(latest)}`}>{getRiskCategory(latest)}</span>
        </div>
      </div>

      {/* Trend chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-100">Risk Score Trend</h2>
          <div className={`flex items-center gap-1 text-xs font-medium ${improved ? 'text-green-400' : 'text-red-400'}`}>
            {improved ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
            {
  trend.length > 1
    ? `${Math.abs(latest - first)} pts`
    : 'Initial assessment'
}
          </div>
        </div>
        <Sparkline data={trend} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

  <div className="card-sm">
    <div className="text-xs text-gray-500">
      Current Risk Score
    </div>

    <div className="text-3xl font-bold text-red-400 mt-2">
      {latest}
    </div>

    <div className="text-xs text-gray-500 mt-1">
      Current assessment
    </div>
  </div>

  <div className="card-sm">
    <div className="text-xs text-gray-500">
      Healthy Benchmark
    </div>

    <div className="text-3xl font-bold text-green-400 mt-2">
      {healthyBenchmark}
    </div>

    <div className="text-xs text-gray-500 mt-1">
      Ideal low-risk profile
    </div>
  </div>

  <div className="card-sm">
    <div className="text-xs text-gray-500">
      Health Gap
    </div>

    <div className="text-3xl font-bold text-yellow-400 mt-2">
      {healthGap}
    </div>

    <div className="text-xs text-gray-500 mt-1">
      Points above healthy target
    </div>
  </div>

</div>


<div className="card">
  <h3 className="font-semibold text-gray-100 mb-2">
    Risk Comparison
  </h3>

  <p className="text-sm text-gray-400">
    {latestPatient
      ? `${latestPatient.patientName} currently has a risk score of ${latest}/100.
         The healthy benchmark is ${healthyBenchmark}/100.
         This places the patient ${healthGap} points above the ideal low-risk profile.`
      : 'No patient assessment available.'}
  </p>
</div>

      {/* Timeline */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-100 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-medical-400" />Clinical Timeline</h2>
        <div className="space-y-0">
          {timeline.map((t, i) => (
            <div key={i} className="flex gap-3 pb-5 relative last:pb-0">
              {i < timeline.length - 1 && <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-800" />}
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 z-10 ${t.color}`}>
                <t.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="text-sm font-medium text-gray-200">{t.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                <div className="text-[10px] text-gray-600 mt-1">{t.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

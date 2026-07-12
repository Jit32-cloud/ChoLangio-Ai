'use client'
import { AlertTriangle, FlaskConical, Activity, TrendingUp, TrendingDown, ChevronRight, Plus, Clock, Shield } from 'lucide-react'
import Link from 'next/link'
import { getRiskBadgeClass, getRiskCategory, getRiskGaugeColor } from '@/lib/utils'

const metrics = [
  { label: 'Assessments Run', value: '47', change: '+8 this month', up: true, color: 'text-medical-400', bg: 'bg-medical-400/10 border-medical-400/20' },
  { label: 'High Risk Cases', value: '3', change: 'Require follow-up', up: false, color: 'text-red-400', bg: 'bg-red-900/20 border-red-800/40' },
  { label: 'Avg Risk Score', value: '38', change: '↓4 pts this week', up: true, color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-800/40' },
  { label: 'Pending Reviews', value: '2', change: 'Labs + imaging', up: null, color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-800/40' },
]

const recentAssessments = [
  { name: 'Anita Singh', age: 67, score: 74, time: '2h ago' },
  { name: 'Rajan Pillai', age: 58, score: 51, time: '5h ago' },
  { name: 'Meena Iyer', age: 44, score: 28, time: '1d ago' },
  { name: 'Suresh Nair', age: 71, score: 82, time: '1d ago' },
  { name: 'Leela Das', age: 55, score: 19, time: '2d ago' },
]

const scoreBreakdown = [
  { label: 'Diet Score', value: 62, color: '#1D9E75' },
  { label: 'Lifestyle Score', value: 55, color: '#378ADD' },
  { label: 'Liver Health', value: 48, color: '#EF9F27' },
  { label: 'Symptom Score', value: 30, color: '#E24B4A' },
  { label: 'Prevention', value: 70, color: '#8B5CF6' },
  { label: 'Wellness', value: 57, color: '#10b981' },
]

function RiskGauge({ score }: { score: number }) {
  const pct = score / 100
  const r = 52, cx = 64, cy = 64
  const circ = 2 * Math.PI * r
  const arc = circ * 0.75
  const offset = arc - pct * arc
  const color = getRiskGaugeColor(score)
  return (
    <div className="flex flex-col items-center">
      <svg width="128" height="96" viewBox="0 0 128 96">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth="10"
          strokeDasharray={`${arc} ${circ}`} strokeDashoffset={0}
          strokeLinecap="round" transform="rotate(135 64 64)" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${arc} ${circ}`} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(135 64 64)"
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }} />
        <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize="22" fontWeight="700">{score}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#6b7280" fontSize="9">/100</text>
      </svg>
      <div className="text-xs font-semibold mt-1" style={{ color }}>{getRiskCategory(score)}</div>
    </div>
  )
}

export function DashboardContent() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">Welcome back, Dr. Sharma — Cholangiocarcinoma Intelligence Platform</p>
        <div className="flex gap-2">
          <Link href="/lab-results" className="btn-outline text-xs py-1.5"><FlaskConical className="w-3.5 h-3.5" /> Enter Labs</Link>
          <Link href="/risk-assessment" className="btn-medical text-xs py-1.5"><Plus className="w-3.5 h-3.5" /> New Assessment</Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map(m => (
          <div key={m.label} className={`card-sm border ${m.bg}`}>
            <div className="text-xs text-gray-500 mb-1">{m.label}</div>
            <div className={`text-2xl font-semibold ${m.color} mb-1`}>{m.value}</div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              {m.up === true && <TrendingUp className="w-3 h-3 text-green-400" />}
              {m.up === false && <TrendingDown className="w-3 h-3 text-red-400" />}
              {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* Alert */}
      <div className="card border-red-900/40">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h2 className="text-sm font-semibold text-gray-100">High-Risk Alerts</h2>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-900/40 text-red-400 border border-red-800">3 active</span>
        </div>
        <div className="space-y-2">
          {[
            { name: 'Suresh Nair, 71M', score: 82, msg: 'PSC + hepatolithiasis + CA 19-9 elevated 94 U/mL. Score 82/100. MRCP urgently needed.', href: '/lab-results' },
            { name: 'Anita Singh, 67F', score: 74, msg: 'Bilirubin 3.8, ALP 290, CA 19-9 67. Jaundice + weight loss 7kg. Imaging review required.', href: '/imaging' },
            { name: 'Rajan Pillai, 58M', score: 51, msg: 'HBV carrier + fatty liver + moderate alcohol. Score 51/100. Lifestyle intervention + LFT recheck.', href: '/follow-up' },
          ].map((a, i) => (
            <div key={i} className={`rounded-lg p-3 flex gap-3 ${a.score > 70 ? 'bg-red-900/15 border border-red-900/40' : 'bg-yellow-900/15 border border-yellow-900/40'}`}>
              <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${a.score > 70 ? 'text-red-400' : 'text-yellow-400'}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${a.score > 70 ? 'text-red-300' : 'text-yellow-300'}`}>{a.name}</span>
                  <Link href={a.href} className={`text-xs flex items-center gap-1 ${a.score > 70 ? 'text-red-400' : 'text-yellow-400'}`}>
                    Review <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <p className="text-xs mt-0.5 text-gray-400">{a.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Population risk gauge */}
        <div className="card flex flex-col items-center">
          <h2 className="text-sm font-semibold text-gray-100 w-full mb-3">Population Avg Risk</h2>
          <RiskGauge score={38} />
          <div className="mt-3 w-full space-y-1.5">
            {[{ label: 'Safe (0–20)', pct: 34, c: '#22c55e' }, { label: 'Low (21–40)', pct: 29, c: '#10b981' }, { label: 'Moderate (41–60)', pct: 21, c: '#eab308' }, { label: 'High (61–80)', pct: 11, c: '#f97316' }, { label: 'Very High (81+)', pct: 5, c: '#ef4444' }].map(r => (
              <div key={r.label} className="flex items-center gap-2">
                <div className="w-20 text-xs text-gray-500 truncate">{r.label}</div>
                <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: `${r.pct}%`, backgroundColor: r.c }} />
                </div>
                <div className="text-xs text-gray-500 w-6 text-right">{r.pct}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent assessments */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-100 flex items-center gap-2"><Activity className="w-4 h-4 text-medical-400" />Recent</h2>
            <Link href="/history" className="text-xs text-medical-400">View all</Link>
          </div>
          <div className="space-y-1">
            {recentAssessments.map((a, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-800/50 last:border-0">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-medium text-gray-400">
                  {a.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-200 truncate">{a.name}, {a.age}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex-1 bg-gray-800 rounded-full h-1">
                      <div className="h-1 rounded-full" style={{ width: `${a.score}%`, backgroundColor: getRiskGaugeColor(a.score) }} />
                    </div>
                    <span className="text-[10px] text-gray-500">{a.score}</span>
                  </div>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getRiskBadgeClass(a.score)}`}>
                  {a.score <= 40 ? 'Low' : a.score <= 60 ? 'Mod' : a.score <= 80 ? 'High' : 'VHigh'}
                </span>
                <span className="text-[10px] text-gray-600">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Health score breakdown */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-100 flex items-center gap-2 mb-3"><Shield className="w-4 h-4 text-medical-400" />Health Scores</h2>
          <div className="space-y-2.5">
            {scoreBreakdown.map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="w-20 text-xs text-gray-400 shrink-0">{s.label}</div>
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${s.value}%`, backgroundColor: s.color }} />
                </div>
                <div className="text-xs font-medium w-7 text-right" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800/60">
            <Link href="/risk-assessment" className="btn-medical w-full justify-center text-xs py-2">
              <Plus className="w-3.5 h-3.5" /> Run Full Assessment
            </Link>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { href: '/lab-results', label: 'Interpret CA 19-9 & LFTs', icon: FlaskConical, color: 'text-yellow-400', bg: 'bg-yellow-900/10 border-yellow-900/30 hover:bg-yellow-900/20' },
          { href: '/imaging', label: 'Analyze MRCP / CT Report', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-900/10 border-blue-900/30 hover:bg-blue-900/20' },
          { href: '/chat', label: 'Ask CholangioAI', icon: Shield, color: 'text-medical-400', bg: 'bg-medical-400/10 border-medical-400/20 hover:bg-medical-400/15' },
          { href: '/education', label: 'CCA Education Hub', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-900/10 border-purple-900/30 hover:bg-purple-900/20' },
        ].map(a => (
          <Link key={a.href} href={a.href} className={`card-sm border flex items-center gap-3 transition-all cursor-pointer ${a.bg}`}>
            <a.icon className={`w-5 h-5 ${a.color} shrink-0`} />
            <span className="text-xs text-gray-300 leading-tight">{a.label}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600 ml-auto shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}

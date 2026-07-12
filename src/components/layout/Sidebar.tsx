'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Activity, Stethoscope, FileText, FlaskConical, Scan, Bot, BookOpen, Clock, CalendarCheck, NotebookPen, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { section: 'Overview', items: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/risk-assessment', label: 'Risk Assessment', icon: Activity },
    { href: '/history', label: 'Risk Progression', icon: TrendingUp },
  ]},
  { section: 'Clinical Tools', items: [
    { href: '/symptom-checker', label: 'Symptom Checker', icon: Stethoscope },
    { href: '/lab-results', label: 'Lab Interpreter', icon: FlaskConical },
    { href: '/imaging', label: 'Report Analysis', icon: Scan },
    { href: '/report-analyzer', label: 'Report Analyzer', icon: FileText },
  ]},
  { section: 'Support', items: [
    { href: '/chat', label: 'AI Chatbot', icon: Bot },
    { href: '/education', label: 'Education Center', icon: BookOpen },
    { href: '/follow-up', label: 'Follow-up Tracker', icon: CalendarCheck },
    { href: '/doctor-prep', label: 'Doctor Preparation', icon: NotebookPen },
  ]},
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-56 bg-gray-950 border-r border-gray-800/60 flex flex-col overflow-y-auto shrink-0">
      <div className="px-4 py-4 border-b border-gray-800/60">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-medical-400 to-medical-500 flex items-center justify-center shrink-0 shadow-lg shadow-medical-400/20">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-100 leading-none">CholangioAI</div>
            <div className="text-[10px] text-gray-500 mt-0.5">CCA Intelligence</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
        {nav.map(s => (
          <div key={s.section}>
            <div className="px-2 mb-1 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">{s.section}</div>
            <div className="space-y-0.5">
              {s.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href
                return (
                  <Link key={href} href={href} className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all',
                    active ? 'bg-medical-400/10 text-medical-400 font-medium' : 'text-gray-500 hover:text-gray-200 hover:bg-gray-800/60'
                  )}>
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-gray-800/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-medical-400/20 flex items-center justify-center text-xs font-medium text-medical-400">PS</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-300 truncate">Dr. Priya Sharma</div>
            <div className="text-[10px] text-gray-600">Hepatobiliary Oncology</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

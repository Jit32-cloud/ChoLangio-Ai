'use client'
import { Sidebar } from './Sidebar'
import { Bell, Search } from 'lucide-react'

interface Props { children: React.ReactNode; title?: string; subtitle?: string }

export function DashboardLayout({ children, title, subtitle }: Props) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm flex items-center px-5 gap-3 shrink-0">
          <div className="flex-1">
            {title && (
              <div>
                <h1 className="text-sm font-semibold text-gray-100">{title}</h1>
                {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search..." className="bg-gray-800/60 border border-gray-700/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-medical-400 w-48" />
            </div>
            <button className="relative w-8 h-8 rounded-lg hover:bg-gray-800 flex items-center justify-center transition-colors">
              <Bell className="w-4 h-4 text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-medical-400/10 border border-medical-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-medical-400 animate-pulse" />
              
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  )
}

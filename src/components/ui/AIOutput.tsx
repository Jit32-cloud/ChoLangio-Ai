'use client'
import {
  Sparkles,
  Copy,
  CheckCheck,
  AlertTriangle,
  Download
} from 'lucide-react'

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props { html: string; label?: string; timestamp?: string; disclaimer?: boolean }

export function AIOutput({ html, label = 'AI Analysis', timestamp, disclaimer = true }: Props) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    const text = new DOMParser().parseFromString(html, 'text/html').body.innerText
    await navigator.clipboard.writeText(text)
    setCopied(true); toast.success('Copied')
    setTimeout(() => setCopied(false), 2000)
  }

async function downloadPDF() {
  try {
    const reportElement = document.getElementById('ai-report-content')

    if (!reportElement) {
      toast.error('Report not found')
      return
    }

    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true
    })

    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4')

    const pdfWidth = 190
    const pdfHeight =
      (canvas.height * pdfWidth) /
      canvas.width

    pdf.addImage(
      imgData,
      'PNG',
      10,
      10,
      pdfWidth,
      pdfHeight
    )

    pdf.save(
      `${label.replace(/\s+/g, '_')}_${Date.now()}.pdf`
    )

    toast.success('PDF downloaded')
  } catch (error) {
    console.error(error)
    toast.error('Failed to download PDF')
  }
}


  return (
    <div className="card mt-4 animate-slide-up">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-800/60">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-medical-400" />
          <span className="text-xs font-semibold text-medical-400">{label}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-medical-400/10 text-medical-400/80 border border-medical-400/20">CholangioAI</span>
        </div>
        <div className="flex items-center gap-2">
          {timestamp && <span className="text-xs text-gray-600">{timestamp}</span>}

<button
  onClick={downloadPDF}
  className="w-7 h-7 rounded-md hover:bg-gray-800 flex items-center justify-center transition-colors"
>
  <Download className="w-3.5 h-3.5 text-gray-500" />
</button>

          
          <button onClick={copy} className="w-7 h-7 rounded-md hover:bg-gray-800 flex items-center justify-center transition-colors">
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
          </button>

        </div>
      </div>
      <div
  id="ai-report-content"
  className="ai-html-output"
  dangerouslySetInnerHTML={{
    __html: html
  }}
/>
      {disclaimer && (
        <div className="mt-3 pt-2 border-t border-gray-800/60 flex items-start gap-2">
          <AlertTriangle className="w-3 h-3 text-yellow-600 mt-0.5 shrink-0" />
          <span className="text-[10px] text-gray-600">AI-assisted clinical decision support. Always verify findings with a hepatobiliary specialist and multidisciplinary team review before clinical decisions.</span>
        </div>
      )}
    </div>
  )
}

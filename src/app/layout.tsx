import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'CholangioAI — Cholangiocarcinoma Risk & Clinical Support',
    template: '%s | CholangioAI',
  },
  description:
    'AI-powered Cholangiocarcinoma (bile duct cancer) risk assessment and clinical decision support platform. Risk scoring, symptom evaluation, lab and imaging interpretation, and patient education.',
  keywords: ['cholangiocarcinoma', 'bile duct cancer', 'AI hepatobiliary oncology', 'clinical decision support', 'CCA risk assessment', 'CA 19-9'],
  authors: [{ name: 'CholangioAI' }],
  robots: { index: false, follow: false }, // HIPAA-inspired: no indexing of medical app
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-gray-950 text-gray-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

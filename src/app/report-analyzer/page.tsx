import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ReportAnalyzerPage } from '@/components/cca/ReportAnalyzerPage'

export const metadata: Metadata = { title: 'Report Analyzer' }

export default function Page() {
  return (
    <DashboardLayout title="Report Analyzer" subtitle="Medical Report Intelligence">
      <ReportAnalyzerPage />
    </DashboardLayout>
  )
}

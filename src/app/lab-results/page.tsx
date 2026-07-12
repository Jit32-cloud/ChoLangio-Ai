import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LabResultsPage } from '@/components/cca/LabResultsPage'

export const metadata: Metadata = { title: 'Lab Interpreter' }

export default function Page() {
  return (
    <DashboardLayout title="Lab Interpreter" subtitle="CCA Biomarker Analysis">
      <LabResultsPage />
    </DashboardLayout>
  )
}

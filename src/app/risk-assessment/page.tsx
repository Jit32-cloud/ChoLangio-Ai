import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { RiskAssessmentPage } from '@/components/cca/RiskAssessmentPage'

export const metadata: Metadata = { title: 'Risk Assessment' }

export default function Page() {
  return (
    <DashboardLayout title="Risk Assessment" subtitle="Comprehensive CCA Risk Scoring">
      <RiskAssessmentPage />
    </DashboardLayout>
  )
}

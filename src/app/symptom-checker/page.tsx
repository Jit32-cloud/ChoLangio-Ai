import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { SymptomCheckerPage } from '@/components/cca/SymptomCheckerPage'

export const metadata: Metadata = { title: 'Symptom Checker' }

export default function Page() {
  return (
    <DashboardLayout title="Symptom Checker" subtitle="CCA Symptom Severity Assessment">
      <SymptomCheckerPage />
    </DashboardLayout>
  )
}

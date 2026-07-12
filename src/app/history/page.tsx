import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { HistoryPage } from '@/components/cca/HistoryPage'

export const metadata: Metadata = { title: 'Risk Progression' }

export default function Page() {
  return (
    <DashboardLayout title="Risk Progression" subtitle="Longitudinal CCA Risk Tracking">
      <HistoryPage />
    </DashboardLayout>
  )
}

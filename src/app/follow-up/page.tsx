import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { FollowUpPage } from '@/components/cca/FollowUpPage'

export const metadata: Metadata = { title: 'Follow-up Tracker' }

export default function Page() {
  return (
    <DashboardLayout title="Follow-up Tracker" subtitle="CCA Surveillance & Action Items">
      <FollowUpPage />
    </DashboardLayout>
  )
}

import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

export const metadata: Metadata = { title: 'Dashboard' }

export default function Page() {
  return (
    <DashboardLayout title="Dashboard" subtitle="CCA Risk Overview">
      <DashboardContent />
    </DashboardLayout>
  )
}

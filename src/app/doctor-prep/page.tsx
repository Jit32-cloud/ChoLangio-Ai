import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DoctorPrepPage } from '@/components/cca/DoctorPrepPage'

export const metadata: Metadata = { title: 'Doctor Preparation' }

export default function Page() {
  return (
    <DashboardLayout title="Doctor Preparation" subtitle="Consultation Preparation Assistant">
      <DoctorPrepPage />
    </DashboardLayout>
  )
}

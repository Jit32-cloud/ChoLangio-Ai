import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { EducationPage } from '@/components/cca/EducationPage'

export const metadata: Metadata = { title: 'Education Center' }

export default function Page() {
  return (
    <DashboardLayout title="Education Center" subtitle="CCA Knowledge Hub">
      <EducationPage />
    </DashboardLayout>
  )
}

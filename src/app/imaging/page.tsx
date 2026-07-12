import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ImagingPage } from '@/components/cca/ImagingPage'

export const metadata: Metadata = { title: 'Imaging Analysis' }

export default function Page() {
  return (
    <DashboardLayout title="Report Analysis" subtitle="Ultrasound · CT · MRI · MRCP">
      <ImagingPage />
    </DashboardLayout>
  )
}

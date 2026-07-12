import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ChatPage } from '@/components/cca/ChatPage'

export const metadata: Metadata = { title: 'CholangioAI Chatbot' }

export default function Page() {
  return (
    <DashboardLayout title="CholangioAI Chatbot" subtitle="CCA Specialized AI Assistant">
      <ChatPage />
    </DashboardLayout>
  )
}

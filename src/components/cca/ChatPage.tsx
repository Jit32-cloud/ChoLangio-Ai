'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles } from 'lucide-react'

interface Msg { role: 'user' | 'assistant'; content: string }

const QUICK_PROMPTS = [
  'What are the early warning signs of cholangiocarcinoma?',
  'Explain CA 19-9 and its significance',
  'What is the Bismuth-Corlette classification?',
  'First-line treatment for unresectable CCA',
  'How does PSC increase CCA risk?',
  'What dietary changes reduce liver disease risk?',
]

export function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: "Hello, I'm CholangioAI — your specialized assistant for cholangiocarcinoma, bile duct health, and liver disease. I can help with risk factors, symptom discussion, lab and imaging interpretation, treatment options, and prevention strategies. How can I help you today?" }
  ])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }) }, [messages])

  async function send(text?: string) {
    const content = (text ?? input).trim()
    if (!content || streaming) return
    setInput('')
    const newMessages: Msg[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setStreaming(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      if (!res.body) throw new Error('No response stream')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''
      setMessages(m => [...m, { role: 'assistant', content: '' }])

      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6)
          if (payload === '[DONE]') continue
          try {
            const { text: delta } = JSON.parse(payload)
            assistantText += delta
            setMessages(m => {
              const copy = [...m]
              copy[copy.length - 1] = { role: 'assistant', content: assistantText }
              return copy
            })
          } catch {}
        }
      }
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Connection error. Please try again.' }])
    } finally {
      setStreaming(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <div className="flex gap-2 flex-wrap mb-3">
        {QUICK_PROMPTS.map(p => (
          <button key={p} onClick={() => send(p)} disabled={streaming}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-700 bg-gray-800/60 text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-colors disabled:opacity-50">
            {p}
          </button>
        ))}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto card space-y-4 mb-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : ''}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-medical-400/15 border border-medical-400/30 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-medical-400" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
              m.role === 'user' ? 'bg-medical-400 text-white rounded-br-sm' : 'bg-gray-800/80 text-gray-200 rounded-bl-sm'
            }`}>
              {m.content || (streaming && i === messages.length - 1 && (
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 typing-dot" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 typing-dot" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 typing-dot" />
                </span>
              ))}
              {m.role === 'assistant' && m.content && i === messages.length - 1 && !streaming && (
                <div className="mt-2 pt-2 border-t border-gray-700/50 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-medical-400" />
                  <span className="text-[10px] text-medical-400/80">Evidence-based · CholangioAI</span>
                </div>
              )}
            </div>
            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-gray-300" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about CCA symptoms, treatment, biomarkers, prevention..."
          className="form-input flex-1"
          disabled={streaming}
        />
        <button onClick={() => send()} disabled={streaming || !input.trim()} className="btn-medical px-4">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

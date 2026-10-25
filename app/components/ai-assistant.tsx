'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react'

interface ChatMessage {
  role: string
  content: string
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I'm Siddharth's AI assistant. Ask me anything about his skills, projects, or experience!" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef?.current?.scrollTo?.({ top: scrollRef?.current?.scrollHeight ?? 0, behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input?.trim?.()
    if (!text || loading) return
    setInput('')
    const userMsg: ChatMessage = { role: 'user', content: text }
    setMessages((prev: ChatMessage[]) => [...(prev ?? []), userMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...(messages ?? []), userMsg] }),
      })

      if (!res?.ok) throw new Error('Failed to get response')

      const reader = res?.body?.getReader?.()
      const decoder = new TextDecoder()
      let assistantContent = ''

      setMessages((prev: ChatMessage[]) => [...(prev ?? []), { role: 'assistant', content: '' }])

      if (reader) {
        let partialRead = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          partialRead += decoder.decode(value, { stream: true })
          const lines = partialRead.split('\n')
          partialRead = lines?.pop?.() ?? ''
          for (const line of (lines ?? [])) {
            if (line?.startsWith?.('data: ')) {
              const data = line?.slice?.(6) ?? ''
              if (data === '[DONE]') continue
              try {
                const parsed = JSON.parse(data)
                const delta = parsed?.choices?.[0]?.delta?.content ?? ''
                if (delta) {
                  assistantContent += delta
                  const newContent = assistantContent
                  setMessages((prev: ChatMessage[]) => {
                    const arr = [...(prev ?? [])]
                    if (arr?.length > 0) {
                      arr[arr.length - 1] = { role: 'assistant', content: newContent }
                    }
                    return arr
                  })
                }
              } catch (_e: any) { /* skip */ }
            }
          }
        }
      }
    } catch (err: any) {
      setMessages((prev: ChatMessage[]) => [...(prev ?? []), { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-all hover:scale-110"
        whileTap={{ scale: 0.95 }}
        aria-label="AI Assistant"
      >
        {open ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: 'rgba(10, 20, 18, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Assistant</p>
                <p className="text-xs text-gray-500">Ask about Siddharth</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="h-[320px] overflow-y-auto p-4 space-y-3">
              {messages?.map?.((msg: ChatMessage, i: number) => (
                <div key={i} className={`flex gap-2 ${msg?.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg?.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex-shrink-0 flex items-center justify-center mt-1">
                      <Bot className="w-3 h-3 text-emerald-400" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg?.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-gray-300'}`}>
                    {msg?.content ?? ''}
                  </div>
                  {msg?.role === 'user' && (
                    <div className="w-6 h-6 rounded-md bg-white/10 flex-shrink-0 flex items-center justify-center mt-1">
                      <User className="w-3 h-3 text-gray-400" />
                    </div>
                  )}
                </div>
              )) ?? []}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex-shrink-0 flex items-center justify-center">
                    <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-white/5 text-sm text-gray-500">Thinking...</div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/5">
              <form
                onSubmit={(e: any) => { e?.preventDefault?.(); sendMessage?.() }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input ?? ''}
                  onChange={(e: any) => setInput(e?.target?.value ?? '')}
                  placeholder="Ask about Siddharth..."
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !(input?.trim?.())}
                  className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

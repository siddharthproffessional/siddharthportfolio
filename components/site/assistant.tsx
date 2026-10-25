'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageSquare, X, Send, Loader2 } from 'lucide-react'

type Msg = { role: 'user' | 'assistant'; content: string }

const GREETING: Msg = {
  role: 'assistant',
  content:
    'Ask about Siddharth’s digital-twin projects, tools or experience. Answers come only from the content of this portfolio.',
}

/**
 * Floating portfolio assistant. It only renders when the server reports that the
 * LLM key is configured, so visitors never see a control that cannot work.
 */
export function Assistant() {
  const [enabled, setEnabled] = useState(false)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/chat')
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((d) => setEnabled(Boolean(d?.enabled)))
      .catch(() => setEnabled(false))
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!enabled) return null

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const history: Msg[] = [...messages.filter((m) => m !== GREETING), { role: 'user', content: text }]
    setMessages((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: '' }])
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      if (!res.ok || !res.body) throw new Error(String(res.status))
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let content = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const delta = JSON.parse(data)?.choices?.[0]?.delta?.content ?? ''
            if (delta) {
              content += delta
              const snapshot = content
              setMessages((prev) => [...prev.slice(0, -1), { role: 'assistant', content: snapshot }])
            }
          } catch {
            /* partial line */
          }
        }
      }
      if (!content) throw new Error('empty')
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'The assistant didn’t respond. Try again, or use the contact form below.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="assistant-panel"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-medium shadow-lg hover:border-accent/60"
      >
        {open ? <X className="h-4 w-4" aria-hidden /> : <MessageSquare className="h-4 w-4 text-accent" aria-hidden />}
        {open ? 'Close' : 'Ask about my work'}
      </button>

      {open && (
        <div
          id="assistant-panel"
          role="dialog"
          aria-label="Portfolio assistant"
          className="fixed bottom-20 right-4 z-40 flex h-[min(32rem,calc(100vh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-border bg-background shadow-2xl"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="font-medium">Portfolio assistant</p>
            <p className="text-xs text-muted-foreground">AI-generated answers based on this site. Check project pages for detail.</p>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === 'user'
                    ? 'ml-8 rounded-lg bg-accent/15 px-3 py-2 text-sm'
                    : 'mr-8 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground/90'
                }
              >
                {m.content || (loading && i === messages.length - 1 ? <Loader2 className="h-4 w-4 animate-spin" aria-label="Thinking" /> : null)}
              </div>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-border p-3">
            <label htmlFor="assistant-input" className="sr-only">
              Your question
            </label>
            <input
              id="assistant-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="e.g. What does HeatShield simulate?"
              className="h-10 flex-1 rounded-md border border-border bg-card px-3 text-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send question"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}

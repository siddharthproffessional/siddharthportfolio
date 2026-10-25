'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Fields = { name: string; email: string; subject: string; message: string; company: string }
type Errors = Partial<Record<keyof Fields, string>>
type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string; mailto?: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (!f.name.trim()) e.name = 'Enter your name.'
  else if (f.name.length > 100) e.name = 'Use 100 characters or fewer.'
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Enter an email address like name@company.com.'
  if (f.subject.length > 150) e.subject = 'Use 150 characters or fewer.'
  if (f.message.trim().length < 10) e.message = 'Write at least 10 characters.'
  else if (f.message.length > 5000) e.message = 'Use 5,000 characters or fewer.'
  return e
}

export function ContactForm({ email }: { email: string }) {
  const [f, setF] = useState<Fields>({ name: '', email: '', subject: '', message: '', company: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<State>({ kind: 'idle' })

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setF((prev) => ({ ...prev, [k]: e.target.value }))
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }))
  }

  const mailtoFor = (x: Fields) =>
    `mailto:${email}?subject=${encodeURIComponent(x.subject || 'Portfolio enquiry')}&body=${encodeURIComponent(
      `${x.message}\n\n— ${x.name} (${x.email})`,
    )}`

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(f)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0]
      document.getElementById(`contact-${first}`)?.focus()
      return
    }
    setState({ kind: 'sending' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setState({ kind: 'sent' })
        setF({ name: '', email: '', subject: '', message: '', company: '' })
        return
      }
      if (res.status === 400 && data?.fields) {
        setErrors(data.fields)
        setState({ kind: 'idle' })
        return
      }
      setState({
        kind: 'error',
        message:
          res.status === 503
            ? 'The contact form isn’t connected to storage on this deployment. Send the same message by email instead.'
            : res.status === 429
              ? 'Too many messages from this connection. Wait a few minutes or send it by email.'
              : 'The message couldn’t be saved. Send it by email instead.',
        mailto: mailtoFor(f),
      })
    } catch {
      setState({ kind: 'error', message: 'No connection to the server. Send the message by email instead.', mailto: mailtoFor(f) })
    }
  }

  if (state.kind === 'sent') {
    return (
      <div role="status" className="rounded-lg border border-accent/50 bg-accent/10 p-6">
        <p className="font-semibold">Message sent.</p>
        <p className="mt-1 text-muted-foreground">Thanks — I’ll reply to the email address you gave.</p>
        <button type="button" onClick={() => setState({ kind: 'idle' })} className="link mt-4 text-sm">
          Send another message
        </button>
      </div>
    )
  }

  const input =
    'mt-1.5 w-full rounded-lg border bg-background/60 px-3.5 py-3 text-[0.95rem] text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-ring'

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <input id="contact-name" autoComplete="name" value={f.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} className={cn(input, errors.name ? 'border-destructive' : 'border-border')} />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input id="contact-email" type="email" autoComplete="email" value={f.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} className={cn(input, errors.email ? 'border-destructive' : 'border-border')} />
        </Field>
      </div>
      <Field id="subject" label="Subject" optional error={errors.subject}>
        <input id="contact-subject" value={f.subject} onChange={set('subject')} aria-invalid={!!errors.subject} className={cn(input, errors.subject ? 'border-destructive' : 'border-border')} />
      </Field>
      <Field id="message" label="Message" error={errors.message}>
        <textarea id="contact-message" rows={6} value={f.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'err-message' : undefined} className={cn(input, 'resize-y', errors.message ? 'border-destructive' : 'border-border')} />
      </Field>
      {/* Honeypot: hidden from people, filled in by most bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" tabIndex={-1} autoComplete="off" value={f.company} onChange={set('company')} />
      </div>

      {state.kind === 'error' && (
        <div role="alert" className="rounded-md border border-destructive/60 bg-destructive/10 p-4 text-sm">
          <p>{state.message}</p>
          {state.mailto && (
            <a href={state.mailto} className="link mt-2 inline-block">
              Open in your email app
            </a>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={state.kind === 'sending'}
        className="btn btn-primary disabled:opacity-60"
      >
        {state.kind === 'sending' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {state.kind === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={`contact-${id}`} className="text-sm font-medium">
        {label}
        {optional && <span className="font-normal text-muted-foreground"> (optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`err-${id}`} className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

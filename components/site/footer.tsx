'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name} · {site.location}
        </p>
        <div className="flex items-center gap-5">
          <a href={`mailto:${site.email}`} className="hover:text-foreground">
            Email
          </a>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            GitHub
          </a>
          <a href="#top" className="inline-flex items-center gap-1 hover:text-foreground">
            <ArrowUp className="h-4 w-4" aria-hidden />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}

/** Floating back-to-top control that appears after scrolling one screen. */
export function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    document.getElementById('top')?.focus({ preventScroll: true })
  }
  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={cn(
        'fixed bottom-5 left-5 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-opacity hover:text-accent',
        show ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}

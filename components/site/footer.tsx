'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'
import { Monogram } from './nav'

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-col gap-6 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Monogram className="h-6 w-6" />
          <p>
            © {new Date().getFullYear()} {site.name}
            <span className="mx-2 text-border">/</span>
            {site.title}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <a href={`mailto:${site.email}`} className="transition-colors hover:text-foreground">
            Email
          </a>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
            GitHub
          </a>
          <a href="#top" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
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
        'glass fixed bottom-5 right-5 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-[opacity,transform] duration-normal hover:-translate-y-0.5 hover:text-accent',
        show ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}

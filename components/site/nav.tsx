'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Download, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { resumeRequestHref, type ResumeAvailability } from '@/lib/site'

const links = [
  { label: 'Projects', hash: 'projects' },
  { label: 'About', hash: 'about' },
  { label: 'Skills', hash: 'skills' },
  { label: 'Experience', hash: 'experience' },
  { label: 'Contact', hash: 'contact' },
]

export function Nav({ resume }: { resume: ResumeAvailability }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const onHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const href = (hash: string) => (onHome ? `#${hash}` : `/#${hash}`)
  const resumeHref = resume.pdf ?? resumeRequestHref()

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-colors',
        scrolled || open ? 'border-border bg-background/95 backdrop-blur' : 'border-transparent bg-background',
      )}
    >
      <nav aria-label="Main" className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <Monogram />
          <span className="font-display text-[1.05rem] font-semibold tracking-tight [font-stretch:88%]">
            Siddharth Dialani
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.hash}>
              <a
                href={href(l.hash)}
                className="rounded-md px-3 py-2 text-[0.95rem] text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="ml-2">
            <a
              href={resumeHref}
              {...(resume.pdf ? { download: true } : {})}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-3.5 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              {resume.pdf ? <Download className="h-4 w-4" aria-hidden /> : <Mail className="h-4 w-4" aria-hidden />}
              {resume.pdf ? 'Resume' : 'Request resume'}
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-border md:hidden">
          <ul className="container-page flex flex-col py-3">
            {links.map((l) => (
              <li key={l.hash}>
                <a
                  href={href(l.hash)}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-3 text-base text-foreground hover:text-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={resumeHref}
                {...(resume.pdf ? { download: true } : {})}
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
              >
                {resume.pdf ? 'Download resume' : 'Request resume'}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

/** Monogram: an isometric cube outline — a nod to 3D scenes without decoration. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn('h-7 w-7 text-accent', className)} fill="none">
      <path d="M16 3 28 10v12l-12 7-12-7V10l12-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 10l12 7 12-7M16 17v12" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" opacity=".55" />
    </svg>
  )
}

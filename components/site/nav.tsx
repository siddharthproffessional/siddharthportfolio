'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Menu, X, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { resumeRequestHref, type ResumeAvailability } from '@/lib/site'
import { EASE, useReduced } from './motion'

const links = [
  { label: 'Work', hash: 'projects' },
  { label: 'Process', hash: 'process' },
  { label: 'About', hash: 'about' },
  { label: 'Skills', hash: 'skills' },
  { label: 'Experience', hash: 'experience' },
  { label: 'Contact', hash: 'contact' },
]

export function Nav({ resume }: { resume: ResumeAvailability }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const pathname = usePathname()
  const onHome = pathname === '/'
  const reduce = useReduced()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active-section tracking on the home page
  useEffect(() => {
    if (!onHome) {
      setActive(null)
      return
    }
    const els = links.map((l) => document.getElementById(l.hash)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [onHome])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const href = (hash: string) => (onHome ? `#${hash}` : `/#${hash}`)
  const resumeHref = resume.pdf ?? resumeRequestHref()
  const resumeProps = resume.pdf ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={cn(
          'transition-[background-color,border-color,backdrop-filter] duration-slow ease-out',
          scrolled || open ? 'border-b border-white/[0.07] bg-background/70 backdrop-blur-xl' : 'border-b border-transparent',
        )}
      >
        <nav aria-label="Main" className="container-page flex h-16 items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
            <Monogram />
            <span className="text-[0.95rem] font-medium tracking-tight">Siddharth Dialani</span>
          </Link>

          <ul className="hidden items-center gap-0.5 rounded-full p-1 lg:flex">
            {links.map((l) => (
              <li key={l.hash} className="relative">
                <a
                  href={href(l.hash)}
                  aria-current={active === l.hash ? 'true' : undefined}
                  className={cn(
                    'relative z-10 block rounded-full px-3.5 py-1.5 text-sm transition-colors duration-normal',
                    active === l.hash ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {l.label}
                </a>
                {active === l.hash && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.06]"
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a href={resumeHref} {...resumeProps} className="btn btn-primary hidden !py-2 text-sm sm:inline-flex">
              <FileText className="h-4 w-4" aria-hidden />
              {resume.pdf ? 'Resume' : 'Request resume'}
            </a>
            <button
              type="button"
              className="glass inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
        <motion.div aria-hidden style={{ scaleX: progress }} className="h-px origin-left bg-gradient-to-r from-accent via-violet to-accent" />
      </div>

      {/* Opens with a staggered reveal; closes instantly so anchor navigation is never delayed */}
      {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 top-16 z-30 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="container-page flex flex-col gap-1 pt-6">
              {links.map((l, i) => (
                <motion.li
                  key={l.hash}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.04 * i, ease: EASE }}
                >
                  <a
                    href={href(l.hash)}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b border-border py-4 font-display text-4xl text-foreground active:text-accent"
                  >
                    {l.label}
                    <span className="annotation">{String(i + 1).padStart(2, '0')}</span>
                  </a>
                </motion.li>
              ))}
              <motion.li initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="pt-6">
                <a href={resumeHref} {...resumeProps} onClick={() => setOpen(false)} className="btn btn-primary w-full">
                  <FileText className="h-4 w-4" aria-hidden />
                  {resume.pdf ? 'View resume (PDF)' : 'Request resume'}
                </a>
              </motion.li>
            </ul>
          </motion.div>
      )}
    </header>
  )
}

/** Monogram: an isometric cube outline. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn('h-7 w-7', className)} fill="none">
      <defs>
        <linearGradient id="mono-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="hsl(var(--accent))" />
          <stop offset="1" stopColor="hsl(var(--violet))" />
        </linearGradient>
      </defs>
      <path d="M16 3 28 10v12l-12 7-12-7V10l12-7Z" stroke="url(#mono-g)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 10l12 7 12-7M16 17v12" stroke="url(#mono-g)" strokeWidth="1.6" strokeLinejoin="round" opacity=".55" />
    </svg>
  )
}

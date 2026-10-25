'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Motion system. One easing family and a small set of reveal styles, each used where it fits:
 *  - rise:   short vertical rise + fade (section headings, text blocks)
 *  - mask:   clip-path wipe (images, media frames)
 *  - focus:  blur-to-sharp (supporting panels)
 *  - scale:  slight scale-in (cards, glass panels)
 * All of them collapse to no motion when the visitor prefers reduced motion.
 */
export const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Reduced-motion preference that is identical on the server and the first client render
 * (false), then reflects the visitor's setting after mount — avoids hydration mismatches.
 */
export function useReduced(): boolean {
  const pref = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted && Boolean(pref)
}
export const DUR = { fast: 0.16, normal: 0.26, slow: 0.7 } as const

type RevealKind = 'rise' | 'mask' | 'focus' | 'scale'

const variants: Record<RevealKind, Variants> = {
  rise: { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } },
  mask: { hidden: { clipPath: 'inset(0 0 100% 0 round 14px)' }, show: { clipPath: 'inset(0 0 0% 0 round 14px)' } },
  focus: { hidden: { opacity: 0, filter: 'blur(10px)' }, show: { opacity: 1, filter: 'blur(0px)' } },
  scale: { hidden: { opacity: 0, scale: 0.965 }, show: { opacity: 1, scale: 1 } },
}

export function Reveal({
  children,
  kind = 'rise',
  delay = 0,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  kind?: RevealKind
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'figure'
}) {
  const reduce = useReduced()
  const Comp = motion[as]
  if (reduce) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={variants[kind]}
      transition={{ duration: kind === 'mask' ? 1.1 : DUR.slow, delay, ease: EASE }}
    >
      {children}
    </Comp>
  )
}

/** Word-by-word masked text reveal for display headings. */
export function SplitReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  as = 'span',
  id,
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  as?: 'span' | 'h1' | 'h2'
  id?: string
}) {
  const reduce = useReduced()
  const words = text.split(' ')
  const Tag = as
  if (reduce)
    return (
      <Tag id={id} className={className}>
        <span className={wordClassName}>{text}</span>
      </Tag>
    )
  return (
    <Tag id={id} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span
            className={cn('inline-block', wordClassName)}
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.95, delay: delay + i * 0.08, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? '\u00a0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Vertical parallax for media inside an overflow-hidden frame. */
export function Parallax({ children, amount = 40, className }: { children: React.ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReduced()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount])
  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div style={reduce ? undefined : { y, scale: 1.08 }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  )
}

/** Glass panel with a restrained pointer-following sheen (mouse only). */
export function GlassPanel({ children, className, as = 'div' }: { children: React.ReactNode; className?: string; as?: 'div' | 'aside' | 'form' }) {
  const ref = useRef<HTMLDivElement>(null)
  const Tag = as as 'div'
  return (
    <Tag
      ref={ref}
      className={cn('glass glass-sheen rounded-xl', className)}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
        ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
        ref.current.style.setProperty('--sheen', '1')
      }}
      onPointerLeave={() => ref.current?.style.setProperty('--sheen', '0')}
    >
      {children}
    </Tag>
  )
}

function CountUp({ to, duration = 1.6 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReduced()
  const [value, setValue] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView || reduce) return
    let raf = 0
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000))
      setValue(Math.round(to * (1 - Math.pow(1 - t, 4))))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, to, duration])
  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString('en-US')}
    </span>
  )
}

/** Verified figures from the project repositories — each links to its source page. */
const FACTS = [
  { value: 88, label: 'thermal zones in the HeatShield building model', href: '/projects/heatshield' },
  { value: 8760, label: 'hourly records per annual HeatShield scenario run', href: '/projects/heatshield' },
  { value: 32, label: 'automated model and data tests passing', href: '/projects/heatshield' },
  { value: 6, label: 'retrofit scenarios in the Environmental Twin', href: '/projects/dubai-environmental-twin' },
]

export function EvidenceStrip() {
  return (
    <section aria-label="Project figures" className="relative border-y border-border bg-card/40">
      <div className="container-page">
        <ul className="grid grid-cols-2 md:grid-cols-4">
          {FACTS.map((f, i) => (
            <li key={f.label} className={cn('border-border', i % 2 === 1 && 'border-l', i >= 2 && 'border-t md:border-t-0', i === 2 && 'md:border-l')}>
              <Link href={f.href} className="group block px-3 py-8 sm:px-6 md:py-10">
                <span className="block font-display text-5xl text-foreground sm:text-6xl">
                  <CountUp to={f.value} />
                </span>
                <span className="mt-2 block max-w-[22ch] text-sm text-muted-foreground transition-colors group-hover:text-foreground">{f.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

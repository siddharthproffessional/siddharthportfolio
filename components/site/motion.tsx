'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/** Fades content up once as it enters the viewport. Disabled for reduced motion. */
export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function CountUp({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView || reduce) return
    let raf = 0
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000))
      setValue(Math.round(to * (1 - Math.pow(1 - t, 3))))
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
    <section aria-label="Project figures" className="border-b border-border">
      <div className="container-page">
      <ul className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
        {FACTS.map((f) => (
          <li key={f.label} className="bg-background">
            <Link href={f.href} className="group block px-1 py-7 sm:px-5 md:py-9">
              <span className="block font-display text-4xl font-semibold text-foreground [font-stretch:85%] sm:text-5xl">
                <CountUp to={f.value} />
              </span>
              <span className="mt-2 block text-sm text-muted-foreground group-hover:text-foreground">{f.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </section>
  )
}

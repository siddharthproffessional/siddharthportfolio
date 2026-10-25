'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { certifications, education, experience } from '@/lib/profile'
import { Reveal, useReduced } from './motion'

type Entry = { when: string; type: string; title: string; org: string; points?: string[]; current?: boolean }

const ENTRIES: Entry[] = [
  ...education.filter((e) => e.period.startsWith('Expected')).map((e) => ({ when: e.period, type: 'Education', title: e.title, org: e.org, current: true })),
  ...experience.map((r) => ({ when: r.period, type: 'Experience', title: r.title, org: `${r.org} · ${r.location}`, points: r.points, current: r.period.includes('Present') })),
  ...certifications.map((c) => ({ when: c.date, type: 'Certification', title: c.title, org: c.issuer })),
  ...education.filter((e) => !e.period.startsWith('Expected')).map((e) => ({ when: e.period, type: 'Education', title: e.title, org: e.org })),
]

/** Experience, certifications and education from the resume, with a line that fills as you scroll. */
export function Timeline() {
  const ref = useRef<HTMLOListElement>(null)
  const reduce = useReduced()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26 })

  return (
    <ol ref={ref} className="relative ml-2 border-l border-border sm:ml-[9.5rem]">
      <motion.span aria-hidden style={reduce ? { scaleY: 1 } : { scaleY: fill }} className="absolute -left-px top-0 h-full w-px origin-top bg-gradient-to-b from-accent via-violet to-accent/20" />
      {ENTRIES.map((e) => (
        <li key={e.title + e.when} className="relative pb-14 pl-8 last:pb-0 sm:pl-12">
          <span aria-hidden className="absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full border border-accent bg-background">
            {e.current && <span className="absolute inset-[1.5px] rounded-full bg-accent" />}
          </span>
          <p className="annotation sm:absolute sm:-left-[9.5rem] sm:top-1.5 sm:w-28 sm:text-right">{e.when || '—'}</p>
          <Reveal kind="focus">
            <p className="mt-1 text-sm text-accent sm:mt-0">{e.type}</p>
            <h3 className="mt-1.5 text-3xl">{e.title}</h3>
            <p className="mt-1 text-foreground/80">{e.org}</p>
            {e.points && (
              <ul className="mt-4 max-w-2xl space-y-2 text-[0.975rem] text-foreground/85">
                {e.points.map((pt) => (
                  <li key={pt} className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-accent">
                    {pt}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </li>
      ))}
    </ol>
  )
}

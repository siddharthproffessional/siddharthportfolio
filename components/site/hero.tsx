'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin, Move3d } from 'lucide-react'
import { site, type ResumeAvailability } from '@/lib/site'
import { cn } from '@/lib/utils'
import { ResumeLinks } from './resume-links'
import type { Stage } from './twin-scene'

const TwinScene = dynamic(() => import('./twin-scene'), { ssr: false })

const STAGES = [
  { name: 'Capture', note: 'Scan builds a point cloud' },
  { name: 'Model', note: 'Edges drawn over the scan' },
  { name: 'Simulate', note: 'Sun-driven surface heat map' },
]

export function Hero({ resume }: { resume: ResumeAvailability }) {
  const reduce = useReducedMotion()
  const [stage, setStage] = useState<Stage>(reduce ? 2 : 0)

  const item = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
        }

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-border">
      {/* Desktop: the 3D scene fills the hero behind the text. Mobile: it sits below the text. */}
      <div className="relative flex flex-col lg:block lg:min-h-[min(calc(100vh-4rem),860px)]">
        <div className="container-page relative z-10 pb-8 pt-14 md:pt-20 lg:flex lg:min-h-[min(calc(100vh-4rem),860px)] lg:items-center lg:py-20">
          <div className="max-w-[36rem]">
            <motion.p {...item(0)} className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-accent" aria-hidden />
              {site.location}
            </motion.p>
            <motion.h1 {...item(1)} id="hero-title" className="text-[2.75rem] font-semibold leading-[1] sm:text-6xl lg:text-[4.5rem]">
              {site.name}
            </motion.h1>
            <motion.p {...item(2)} className="mt-5 font-display text-xl font-medium text-foreground/85 [font-stretch:92%] sm:text-2xl">
              {site.title}
            </motion.p>
            <motion.p {...item(3)} className="prose-body mt-6 text-muted-foreground">
              {site.statement}
            </motion.p>
            <motion.div {...item(4)} className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-[0.95rem] font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                View projects
              </a>
              <ResumeLinks resume={resume} />
              <a href="#contact" className="px-2 py-2.5 text-[0.95rem] text-muted-foreground transition-colors hover:text-foreground">
                Contact
              </a>
            </motion.div>
          </div>
        </div>

        <div className="relative h-[380px] sm:h-[460px] lg:absolute lg:inset-0 lg:h-auto">
          <TwinScene onStage={(s) => setStage(s)} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
          {/* Legibility fade behind the headline on wide screens */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-[58%] bg-gradient-to-r from-background via-background/85 to-transparent lg:block" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent lg:hidden" />

          <div className="absolute bottom-4 right-4 z-10 w-[min(21rem,calc(100%-2rem))] rounded-lg border border-border bg-background/80 p-3 backdrop-blur lg:bottom-8 lg:right-8">
            <ol className="grid grid-cols-3 gap-2" aria-label="Animation stages">
              {STAGES.map((s, i) => (
                <li key={s.name} aria-current={stage === i ? 'step' : undefined}>
                  <span className={cn('block h-0.5 rounded-full transition-colors duration-normal', stage >= i ? 'bg-accent' : 'bg-border')} />
                  <span className={cn('mt-2 block text-sm font-medium transition-colors', stage === i ? 'text-foreground' : 'text-muted-foreground')}>
                    {s.name}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Move3d className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {STAGES[stage].note}. Illustrative scene — drag to rotate.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

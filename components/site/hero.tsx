'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion} from 'framer-motion'
import { ArrowDown, Download, FileText, Move3d } from 'lucide-react'
import { resumeRequestHref, site, type ResumeAvailability } from '@/lib/site'
import { cn } from '@/lib/utils'
import { EASE, SplitReveal, useReduced } from './motion'
import type { HeroStage } from '@/lib/three/stages'

const DistrictCanvas = dynamic(() => import('./district-canvas'), { ssr: false })

const STAGES: HeroStage[] = ['Wireframe', 'Clay', 'Material']

export function Hero({ resume }: { resume: ResumeAvailability }) {
  const reduce = useReduced()
  const [stage, setStage] = useState<HeroStage>('Wireframe')

  // Always declare the same initial/animate pair so server and client markup match;
  // reduced-motion visitors get an instant transition instead of a different tree.
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 14, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: reduce ? { duration: 0 } : { duration: 0.9, delay, ease: EASE },
  })

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Scene: full-bleed behind the text on desktop, a framed band below the text on mobile */}
      <div className="relative flex min-h-[100svh] flex-col lg:block">
        <div className="relative z-10 order-1 pt-28 lg:absolute lg:inset-0 lg:flex lg:items-center lg:pt-16">
          <div className="container-page">
            <div className="max-w-[40rem]">
              <motion.p {...fade(0.05)} className="annotation mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-accent/70" aria-hidden />
                25.20° N, 55.27° E · {site.location}
              </motion.p>
              <SplitReveal as="h1" id="hero-title" text={site.name} delay={0.15} wordClassName="metallic" className="block text-[3.4rem] leading-[0.95] sm:text-7xl lg:text-[6.4rem]" />
              <motion.p {...fade(0.55)} className="mt-5 text-lg font-medium text-foreground/90 sm:text-xl">
                {site.title}
              </motion.p>
              <motion.p {...fade(0.7)} className="mt-7 font-display text-[1.75rem] italic leading-tight text-foreground sm:text-[2.1rem]">
                {site.headline}
              </motion.p>
              <motion.p {...fade(0.82)} className="prose-body mt-4 text-muted-foreground">
                {site.statement}
              </motion.p>
              <motion.div {...fade(0.95)} className="mt-9 flex flex-wrap items-center gap-3">
                <a href="#projects" className="btn btn-primary">
                  Explore projects
                </a>
                {resume.pdf ? (
                  <>
                    <a href={resume.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                      <FileText className="h-4 w-4" aria-hidden />
                      View resume
                    </a>
                    <a href={resume.pdf} download className="btn !px-3 text-muted-foreground hover:text-foreground" aria-label="Download resume as PDF">
                      <Download className="h-4 w-4" aria-hidden />
                      <span className="hidden sm:inline">PDF</span>
                    </a>
                  </>
                ) : (
                  <a href={resumeRequestHref()} className="btn btn-ghost">
                    Request resume
                  </a>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="relative order-2 mt-6 h-[58svh] min-h-[340px] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_40%,hsl(var(--accent)/0.10),transparent_70%)]" />
          <DistrictCanvas mode="hero" onStage={setStage} className="absolute inset-0" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-[56%] bg-gradient-to-r from-background via-background/80 to-transparent lg:block" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.8, delay: 1.2, ease: EASE }}
            className="glass absolute bottom-6 right-4 z-10 w-[min(19rem,calc(100%-2rem))] rounded-xl p-3.5 lg:bottom-10 lg:right-10"
          >
            <ol className="grid grid-cols-3 gap-2" aria-label="Render stages">
              {STAGES.map((s, i) => (
                <li key={s} aria-current={stage === s ? 'step' : undefined}>
                  <span className={cn('block h-0.5 rounded-full transition-colors duration-slow', STAGES.indexOf(stage) >= i ? 'bg-accent' : 'bg-white/10')} />
                  <span className={cn('mt-2 block text-[0.8rem] transition-colors duration-normal', stage === s ? 'text-foreground' : 'text-muted-foreground')}>{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Move3d className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Concept scene — drag to rotate
            </p>
          </motion.div>
        </div>

        <a
          href="#process"
          className="scroll-cue absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted-foreground hover:text-foreground lg:flex"
        >
          Scroll
          <span className="relative block h-10 w-px overflow-hidden bg-white/10" aria-hidden>
            <span className="absolute inset-0 bg-foreground/70" />
          </span>
          <ArrowDown className="sr-only" />
        </a>
      </div>
    </section>
  )
}

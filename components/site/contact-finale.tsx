'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Download, FileText } from 'lucide-react'
import { resumeRequestHref, type ResumeAvailability } from '@/lib/site'
import { SplitReveal, useReduced } from './motion'

/**
 * Closing section. As it enters, a horizon line widens and the page warms toward the
 * accent — a single transition into the final call to action.
 */
export function ContactFinale({ resume, children }: { resume: ResumeAvailability; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReduced()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 30%'] })
  const width = useTransform(scrollYProgress, [0, 1], ['12%', '100%'])
  const glow = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-border">
      <motion.div
        aria-hidden
        style={{ opacity: reduce ? 1 : glow }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,hsl(var(--accent)/0.14),transparent_70%)]"
      />
      <div className="container-page relative py-24 md:py-32">
        <motion.div aria-hidden style={{ width: reduce ? '100%' : width }} className="mx-auto h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="mx-auto mt-16 max-w-4xl text-center">
          <p className="annotation">Contact</p>
          <SplitReveal as="h2" id="contact-title" text="Let’s talk about digital twins." className="mt-5 block text-5xl sm:text-7xl lg:text-8xl" />
          <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] text-muted-foreground">
            Open to junior Digital Twin, Simulation, 3D Integration and Physical AI / robotics simulation roles in Dubai.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {resume.pdf ? (
              <>
                <a href={resume.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <FileText className="h-4 w-4" aria-hidden />
                  View resume
                </a>
                <a href={resume.pdf} download className="btn btn-ghost">
                  <Download className="h-4 w-4" aria-hidden />
                  PDF
                </a>
                {resume.docx && (
                  <a href={resume.docx} download className="btn btn-ghost">
                    <Download className="h-4 w-4" aria-hidden />
                    Word
                  </a>
                )}
              </>
            ) : (
              <a href={resumeRequestHref()} className="btn btn-primary">
                Request resume
              </a>
            )}
          </div>
        </div>
        <div className="mt-20">{children}</div>
      </div>
    </section>
  )
}

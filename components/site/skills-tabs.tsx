'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion} from 'framer-motion'
import { cn } from '@/lib/utils'
import { languages, skillGroups } from '@/lib/profile'
import { EASE, useReduced } from './motion'

/**
 * Skills from the resume, grouped as on the resume. A layered plane stack mirrors the
 * groups (the active layer lifts). No proficiency ratings are shown.
 */
export function SkillsTabs() {
  const reduce = useReduced()
  const [active, setActive] = useState(0)
  const group = skillGroups[active]

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (a + 1) % skillGroups.length)
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (a - 1 + skillGroups.length) % skillGroups.length)
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="min-w-0 lg:col-span-4">
        <div role="tablist" aria-label="Skill groups" aria-orientation="vertical" onKeyDown={onKey} className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {skillGroups.map((g, i) => (
            <button
              key={g.id}
              id={`tab-${g.id}`}
              role="tab"
              type="button"
              aria-selected={active === i}
              aria-controls={`panel-${g.id}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn('relative shrink-0 rounded-xl px-4 py-3 text-left transition-colors', active === i ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              {active === i && (
                <motion.span layoutId="skills-tab" className="glass absolute inset-0 rounded-xl" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }} />
              )}
              <span className="relative flex items-baseline justify-between gap-6">
                <span className="whitespace-nowrap font-medium">{g.group}</span>
                <span className="annotation hidden lg:inline">{g.skills.length}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Layered stack visual */}
        <div aria-hidden className="mx-auto mt-10 hidden h-48 w-56 [perspective:900px] lg:block">
          <div className="relative h-full w-full [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-38deg)]">
            {skillGroups.map((g, i) => (
              <div
                key={g.id}
                className={cn(
                  'absolute inset-0 rounded-xl border transition-all duration-slow ease-out',
                  active === i ? 'border-accent/70 bg-accent/15' : 'border-white/10 bg-white/[0.02]',
                )}
                style={{ transform: `translateZ(${i * 26 + (active === i ? 18 : 0)}px)` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="min-w-0 lg:col-span-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={group.id}
            id={`panel-${group.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${group.id}`}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <p className="font-display text-3xl text-foreground sm:text-4xl">{group.summary}</p>
            <ul className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
              {group.skills.map((s, i) => (
                <motion.li
                  key={s.name}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.04 * i }}
                  className="flex min-h-[4.25rem] flex-wrap items-center justify-between gap-2 bg-background px-5 py-4"
                >
                  <span className="text-[1.0625rem]">{s.name}</span>
                  {s.evidence && (
                    <span className="flex flex-wrap gap-1.5">
                      {s.evidence.map((e) => (
                        <Link key={e.href + e.label} href={e.href} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:border-accent/60 hover:text-foreground">
                          {e.label}
                        </Link>
                      ))}
                    </span>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-2 border-t border-border pt-6">
          <span className="annotation">Languages</span>
          {languages.map((l) => (
            <span key={l.name} className="text-foreground/85">
              {l.name} <span className="text-muted-foreground">({l.level})</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

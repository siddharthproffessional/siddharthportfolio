'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion} from 'framer-motion'
import { ArrowUpRight, Box, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CAPABILITY, STATUS_LABEL, type Category, type Project, type Status } from '@/lib/projects'
import { StatusBadge } from './status'
import { ProjectVisual } from './project-visuals'
import { EASE, Reveal, useReduced } from './motion'

const STATUSES: (Status | 'all')[] = ['all', 'completed', 'in-progress', 'exploration']
const techKey = (name: string) => name.replace(/\s[\d.]+$/, '')

export function Showcase({ projects, categories, technologies }: { projects: Project[]; categories: Category[]; technologies: string[] }) {
  const reduce = useReduced()
  const [status, setStatus] = useState<Status | 'all'>('all')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [tech, setTech] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((p) => {
      if (status !== 'all' && p.status !== status) return false
      if (category !== 'all' && !p.categories.includes(category)) return false
      if (tech !== 'all' && !p.tech.some((t) => techKey(t.name) === tech)) return false
      if (q && ![p.title, p.tagline, ...p.categories, ...p.tech.map((t) => t.name)].join(' ').toLowerCase().includes(q)) return false
      return true
    })
  }, [projects, status, category, tech, query])

  const active = status !== 'all' || category !== 'all' || tech !== 'all' || query !== ''
  const reset = () => {
    setStatus('all')
    setCategory('all')
    setTech('all')
    setQuery('')
  }
  const field = 'h-10 rounded-full border border-white/10 bg-background/60 px-4 text-sm text-foreground'

  return (
    <div>
      <div className="glass flex flex-col gap-3 rounded-2xl p-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={status === s}
              onClick={() => setStatus(s)}
              className={cn('relative rounded-full px-4 py-2 text-sm transition-colors', status === s ? 'text-background' : 'text-muted-foreground hover:text-foreground')}
            >
              {status === s && (
                <motion.span layoutId="status-pill" className="absolute inset-0 rounded-full bg-foreground" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }} />
              )}
              <span className="relative">{s === 'all' ? 'All' : STATUS_LABEL[s]}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="filter-category">
            Project type
          </label>
          <select id="filter-category" className={field} value={category} onChange={(e) => setCategory(e.target.value as Category | 'all')}>
            <option value="all">All project types</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="filter-tech">
            Technology
          </label>
          <select id="filter-tech" className={field} value={tech} onChange={(e) => setTech(e.target.value)}>
            <option value="all">All technologies</option>
            {technologies.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <label className="sr-only" htmlFor="filter-search">
              Search projects
            </label>
            <input id="filter-search" type="search" placeholder="Search projects" value={query} onChange={(e) => setQuery(e.target.value)} className={cn(field, 'w-full pl-10 sm:w-52')} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground" aria-live="polite">
        <span>
          Showing {filtered.length} of {projects.length} projects
        </span>
        {active && (
          <button type="button" onClick={reset} className="inline-flex items-center gap-1 hover:text-foreground">
            <X className="h-4 w-4" aria-hidden />
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-3xl">No projects match these filters.</p>
          <button type="button" onClick={reset} className="btn btn-ghost mt-5">
            Show all projects
          </button>
        </div>
      ) : (
        <ul className="mt-10 space-y-20 md:space-y-28">
          <AnimatePresence initial={false} mode="popLayout">
            {filtered.map((p, i) => (
              <motion.li
                key={p.slug}
                layout={!reduce}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <ProjectRow project={p} flip={i % 2 === 1} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}

function ProjectRow({ project: p, flip }: { project: Project; flip: boolean }) {
  const app = p.links.find((l) => l.label === 'Open application')
  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14" data-project={p.slug}>
      <Reveal kind="mask" className={cn('lg:col-span-7', flip && 'lg:order-2')}>
        <Link href={`/projects/${p.slug}`} aria-label={`${p.title} — view case study`} className="block rounded-xl focus-visible:outline-offset-4">
          <ProjectVisual project={p} />
        </Link>
      </Reveal>
      <Reveal kind="rise" delay={0.1} className={cn('lg:col-span-5', flip && 'lg:order-1')}>
        <p className="annotation flex flex-wrap items-center gap-x-3 gap-y-1">
          {p.year && <span>{p.year}</span>}
          {p.year && <span className="h-px w-6 bg-border" aria-hidden />}
          <span>{p.categories.join(' · ')}</span>
        </p>
        <h3 className="mt-3 text-4xl sm:text-5xl">
          <Link href={`/projects/${p.slug}`} className="transition-colors hover:text-accent">
            {p.title}
          </Link>
        </h3>
        <p className="mt-4 text-[1.0625rem] text-foreground/80">{p.tagline}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <StatusBadge status={p.status} />
          <span className="text-sm text-muted-foreground">{CAPABILITY[p.capability].label}</span>
        </div>
        <ul className="mt-5 flex flex-wrap gap-2">
          {p.tech.slice(0, 5).map((t) => (
            <li key={t.name} className="rounded-full border border-border px-3 py-1 text-xs text-foreground/80">
              {techKey(t.name)}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={`/projects/${p.slug}`} className="btn btn-primary !py-2 text-sm">
            View case study
          </Link>
          {p.model && (
            <Link href={`/projects/${p.slug}#model`} className="btn btn-ghost !py-2 text-sm">
              <Box className="h-4 w-4" aria-hidden />
              Inspect 3D model
            </Link>
          )}
          {app && (
            <a href={app.href} target="_blank" rel="noopener noreferrer" className="btn !px-3 !py-2 text-sm text-muted-foreground hover:text-foreground">
              Open application
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          )}
        </div>
      </Reveal>
    </article>
  )
}

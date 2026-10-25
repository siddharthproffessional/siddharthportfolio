'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CAPABILITY, STATUS_LABEL, type Category, type Project, type Status } from '@/lib/projects'
import { StatusBadge } from './status'
import { DiagramThumb } from './diagram'

const STATUSES: (Status | 'all')[] = ['all', 'completed', 'in-progress', 'exploration']

const techKey = (name: string) => name.replace(/\s[\d.]+$/, '')

export function ProjectGallery({
  projects,
  categories,
  technologies,
}: {
  projects: Project[]
  categories: Category[]
  technologies: string[]
}) {
  const [status, setStatus] = useState<Status | 'all'>('all')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [tech, setTech] = useState<string>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((p) => {
      if (status !== 'all' && p.status !== status) return false
      if (category !== 'all' && !p.categories.includes(category)) return false
      if (tech !== 'all' && !p.tech.some((t) => techKey(t.name) === tech)) return false
      if (q) {
        const hay = [p.title, p.tagline, ...p.categories, ...p.tech.map((t) => t.name)].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
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

  const selectCls =
    'h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring'

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card/40 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={status === s}
              onClick={() => setStatus(s)}
              className={cn(
                'rounded-md border px-3 py-1.5 text-sm transition-colors',
                status === s
                  ? 'border-accent bg-accent/15 text-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {s === 'all' ? 'All' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="filter-category">
            Project type
          </label>
          <select id="filter-category" className={selectCls} value={category} onChange={(e) => setCategory(e.target.value as Category | 'all')}>
            <option value="all">All project types</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="filter-tech">
            Technology
          </label>
          <select id="filter-tech" className={selectCls} value={tech} onChange={(e) => setTech(e.target.value)}>
            <option value="all">All technologies</option>
            {technologies.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <label className="sr-only" htmlFor="filter-search">
              Search projects
            </label>
            <input
              id="filter-search"
              type="search"
              placeholder="Search projects"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cn(selectCls, 'w-full pl-9 sm:w-52')}
            />
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
        <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center">
          <p>No projects match these filters.</p>
          <button type="button" onClick={reset} className="link mt-2 text-sm">
            Show all projects
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {filtered.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ProjectCard({ project: p }: { project: Project }) {
  const cover = p.media[0]
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-accent/50 focus-within:ring-2 focus-within:ring-ring">
      <div className="relative overflow-hidden border-b border-border">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            sizes="(min-width: 768px) 560px, 100vw"
            className="aspect-[16/10] h-auto w-full object-cover object-left-top"
          />
        ) : (
          <>
            <DiagramThumb data={p.diagram} />
            <span className="absolute bottom-3 left-3 rounded bg-background/90 px-2 py-1 text-xs text-muted-foreground">
              Diagram only — no images published yet
            </span>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <StatusBadge status={p.status} />
          <span className="text-sm text-muted-foreground">{CAPABILITY[p.capability].label}</span>
        </div>
        <h3 className="mt-3 text-xl font-semibold">
          <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {p.title}
          </Link>
        </h3>
        <p className="mt-2 text-[0.95rem] text-muted-foreground">{p.tagline}</p>
        <p className="mt-auto pt-4 text-sm text-foreground/80">
          {p.tech
            .slice(0, 4)
            .map((t) => techKey(t.name))
            .join(', ')}
        </p>
        <span className="mt-3 text-sm font-medium text-accent group-hover:underline group-hover:underline-offset-4">View project</span>
      </div>
    </article>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Check, CircleDashed, Lock } from 'lucide-react'
import { CAPABILITY, EVIDENCE_LABEL, getProject, projects } from '@/lib/projects'
import { StatusBadge } from '@/components/site/status'
import { Diagram } from '@/components/site/diagram'
import { MediaGallery } from '@/components/site/media-gallery'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProject(params.slug)
  if (!p) return {}
  return {
    title: p.title,
    description: p.tagline,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: {
      title: p.title,
      description: p.tagline,
      ...(p.media[0] ? { images: [{ url: p.media[0].src, width: p.media[0].width, height: p.media[0].height, alt: p.media[0].alt }] } : {}),
    },
  }
}

const SECTIONS = [
  ['problem', 'Problem'],
  ['objective', 'Objective'],
  ['implemented', 'What I implemented'],
  ['architecture', 'Architecture'],
  ['technology', 'Technologies'],
  ['media', 'Screenshots'],
  ['results', 'Results & validation'],
  ['challenges', 'Challenges'],
  ['limitations', 'Limitations'],
  ['future', 'Future improvements'],
  ['links', 'Links'],
  ['verification', 'How this page was verified'],
] as const

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-24 border-t border-border py-10 first:border-t-0 first:pt-0">
      <h2 id={id} className="text-2xl font-semibold">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug)
  if (!p) notFound()

  const i = projects.findIndex((x) => x.slug === p.slug)
  const prev = projects[(i - 1 + projects.length) % projects.length]
  const next = projects[(i + 1) % projects.length]

  return (
    <article>
      <header className="border-b border-border">
        <div className="container-page py-10 md:py-14">
          <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All projects
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            <StatusBadge status={p.status} />
            {p.statusNote && <span className="text-sm text-muted-foreground">{p.statusNote}</span>}
          </div>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold sm:text-5xl">{p.title}</h1>
          <p className="prose-body mt-4 text-muted-foreground">{p.tagline}</p>
          <dl className="mt-8 grid max-w-4xl gap-6 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Capability level</dt>
              <dd className="mt-1 font-medium">{CAPABILITY[p.capability].label}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Project type</dt>
              <dd className="mt-1 font-medium">{p.categories.join(', ')}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Evidence</dt>
              <dd className="mt-1 font-medium">{EVIDENCE_LABEL[p.evidence]}</dd>
            </div>
          </dl>
          {p.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {p.links.map((l, idx) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    idx === 0
                      ? 'inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90'
                      : 'inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm hover:border-accent/60 hover:text-accent'
                  }
                >
                  {l.label}
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
        <nav aria-label="On this page" className="hidden lg:block">
          <ul className="sticky top-24 space-y-1.5 text-sm">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="text-muted-foreground hover:text-foreground">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <Block id="problem" title="Problem">
            <p className="prose-body">{p.problem}</p>
          </Block>

          <Block id="objective" title="Objective">
            <p className="prose-body">{p.objective}</p>
          </Block>

          <Block id="implemented" title="What I implemented">
            {p.implemented.length === 0 ? (
              <p className="text-muted-foreground">No implemented stages are published yet. The planned workflow is listed below.</p>
            ) : (
              <ul className="max-w-[72ch] space-y-3">
                {p.implemented.map((item) => (
                  <li key={item.text} className="flex gap-3">
                    {item.verified ? (
                      <Check className="mt-1 h-4 w-4 shrink-0 text-status-complete" aria-label="Verified" />
                    ) : (
                      <CircleDashed className="mt-1 h-4 w-4 shrink-0 text-status-explore" aria-label="Owner-reported, not yet verified" />
                    )}
                    <span className="text-foreground/90">{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
            {p.implemented.some((x) => !x.verified) && (
              <p className="mt-4 text-sm text-muted-foreground">Dashed icon: owner-reported, not yet verified against source or media.</p>
            )}
            {p.planned && p.planned.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold">Planned — not built yet</h3>
                <ul className="mt-3 max-w-[72ch] list-disc space-y-2 pl-5 text-muted-foreground marker:text-status-progress">
                  {p.planned.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            )}
          </Block>

          <Block id="architecture" title="Architecture">
            <Diagram data={p.diagram} id={p.slug} />
          </Block>

          <Block id="technology" title="Technologies and their roles">
            <dl className="divide-y divide-border border-y border-border sm:hidden">
              {p.tech.map((t) => (
                <div key={t.name} className="py-3">
                  <dt className="font-medium">
                    {t.name} <span className="ml-1 text-xs font-normal text-muted-foreground">{t.verified ? 'Checked in source' : 'Not yet checked'}</span>
                  </dt>
                  <dd className="mt-1 text-[0.95rem] text-foreground/85">{t.role}</dd>
                </div>
              ))}
            </dl>
            <div className="hidden sm:block">
              <table className="w-full text-left text-[0.95rem]">
                <thead className="text-sm text-muted-foreground">
                  <tr className="border-b border-border">
                    <th scope="col" className="py-2 pr-6 font-medium">Technology</th>
                    <th scope="col" className="py-2 pr-6 font-medium">Role in this project</th>
                    <th scope="col" className="py-2 font-medium">Checked</th>
                  </tr>
                </thead>
                <tbody>
                  {p.tech.map((t) => (
                    <tr key={t.name} className="border-b border-border align-top">
                      <td className="py-3 pr-6 font-medium">{t.name}</td>
                      <td className="py-3 pr-6 text-foreground/85">{t.role}</td>
                      <td className="whitespace-nowrap py-3 text-sm text-muted-foreground">{t.verified ? 'In source' : 'Not yet'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Block>

          <Block id="media" title="Screenshots">
            <MediaGallery media={p.media} title={p.title} />
          </Block>

          <Block id="results" title="Results & validation">
            <ul className="max-w-[72ch] list-disc space-y-2 pl-5 marker:text-accent">
              {p.results.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </Block>

          <Block id="challenges" title="Technical challenges and solutions">
            {p.challenges.length === 0 ? (
              <p className="text-muted-foreground">Not documented yet.</p>
            ) : (
              <dl className="max-w-[72ch] space-y-6">
                {p.challenges.map((c) => (
                  <div key={c.challenge}>
                    <dt className="font-medium">{c.challenge}</dt>
                    <dd className="mt-1.5 text-foreground/80">{c.solution}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Block>

          <Block id="limitations" title="Current limitations">
            <ul className="max-w-[72ch] list-disc space-y-2 pl-5 text-foreground/90 marker:text-status-progress">
              {p.limitations.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </Block>

          <Block id="future" title="Future improvements">
            <ul className="max-w-[72ch] list-disc space-y-2 pl-5 text-foreground/90 marker:text-muted-foreground">
              {p.future.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </Block>

          <Block id="links" title="Source code and application">
            <ul className="space-y-2">
              {p.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1">
                    {l.label}
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                  <span className="ml-2 break-all text-sm text-muted-foreground">{l.href.replace(/^https:\/\//, '')}</span>
                </li>
              ))}
              {(p.unavailableLinks ?? []).map((u) => (
                <li key={u} className="inline-flex items-center gap-2 text-muted-foreground">
                  <Lock className="h-4 w-4" aria-hidden />
                  {u}
                </li>
              ))}
            </ul>
          </Block>

          <Block id="verification" title="How this page was verified">
            <p className="font-medium">{EVIDENCE_LABEL[p.evidence]}</p>
            <ul className="mt-3 max-w-[72ch] list-disc space-y-2 pl-5 text-muted-foreground">
              {p.verification.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </Block>

          <nav aria-label="More projects" className="mt-6 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
            <Link href={`/projects/${prev.slug}`} className="rounded-lg border border-border p-4 hover:border-accent/60">
              <span className="text-sm text-muted-foreground">Previous project</span>
              <span className="mt-1 block font-medium">{prev.title}</span>
            </Link>
            <Link href={`/projects/${next.slug}`} className="rounded-lg border border-border p-4 text-right hover:border-accent/60">
              <span className="text-sm text-muted-foreground">Next project</span>
              <span className="mt-1 block font-medium">{next.title}</span>
            </Link>
          </nav>
        </div>
      </div>
    </article>
  )
}

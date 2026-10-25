import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Github, Mail, MapPin } from 'lucide-react'
import { site } from '@/lib/site'
import { CAPABILITY, STATUS_LABEL, supportingProjects, workstreams, type Capability } from '@/lib/projects'
import { certifications, education, experience, skillGroups } from '@/lib/profile'
import { StatusDot } from './status'

export function SectionHeading({ id, title, intro }: { id: string; title: string; intro?: string }) {
  return (
    <div className="max-w-2xl">
      <h2 id={id} className="text-3xl font-semibold sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-3 text-muted-foreground">{intro}</p>}
    </div>
  )
}

/** Explains the capability labels used on every project card. */
export function CapabilityLegend() {
  const order: Capability[] = ['tested-simulation', 'interactive-app', 'software', 'blender-model', 'workflow']
  return (
    <details className="mt-8 rounded-lg border border-border">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium hover:text-accent">How to read the capability labels</summary>
      <dl className="grid gap-x-8 gap-y-4 border-t border-border p-4 text-sm sm:grid-cols-2">
        {order.map((c) => (
          <div key={c}>
            <dt className="font-medium">{CAPABILITY[c].label}</dt>
            <dd className="mt-1 text-muted-foreground">{CAPABILITY[c].description}</dd>
          </div>
        ))}
        <div>
          <dt className="font-medium">Live-data digital twin</dt>
          <dd className="mt-1 text-muted-foreground">
            Connected to real sensors or systems. None of the projects here claims this level yet.
          </dd>
        </div>
      </dl>
    </details>
  )
}

export function Workstreams() {
  return (
    <div className="mt-16">
      <h3 className="text-xl font-semibold">Further workstreams</h3>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Related work that will get a full case study once its artifacts are published.
      </p>
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {workstreams.map((w) => (
          <li key={w.title} className="grid gap-2 py-4 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-4">
              <p className="font-medium">{w.title}</p>
              <p className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <StatusDot status={w.status} />
                {STATUS_LABEL[w.status]}
              </p>
            </div>
            <p className="text-[0.95rem] text-foreground/85 md:col-span-6">{w.description}</p>
            <p className="text-sm text-muted-foreground md:col-span-2">{w.evidence}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function About() {
  const focus = [
    ['Digital-twin prototyping', 'Browser twins that connect a 3D scene to a model people can question, as in HeatShield.'],
    ['Built-environment and industrial visualization', 'Buildings, accommodation sites and production lines as navigable scenes.'],
    ['BIM and 3D interoperability', 'Getting Revit and Blender content into real-time and simulation tools intact.'],
    ['OpenUSD workflows', 'USD as the common layer between Blender, Unreal Engine, Omniverse and Isaac Sim.'],
    ['Spatial reconstruction', 'Capturing real spaces with LiDAR, 360° imagery and photogrammetry or splats.'],
    ['Simulation and VR interaction', 'Solar, thermal and physics behaviour, and natural object interaction in VR.'],
    ['AI-assisted development', 'Using Codex, Claude Code and Cursor to build and test tools quickly — then checking the results.'],
  ]
  return (
    <section aria-labelledby="about" className="border-b border-border">
      <div className="container-page grid gap-10 py-16 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-5">
            <Image
              src="/siddharth-profile.webp"
              alt="Portrait of Siddharth Dialani"
              width={480}
              height={480}
              sizes="96px"
              className="h-24 w-24 shrink-0 rounded-full border border-border object-cover"
            />
            <SectionHeading id="about" title="About me" />
          </div>
          <div className="prose-body mt-6 space-y-4 text-foreground/85">
            <p>{site.summary}</p>
            <p>
              I care about the difference between a model, an interactive application, a tested simulation and a
              live-data twin, and I label my own work accordingly. Each project page says what was built, how it was
              checked and what it does not do yet.
            </p>
          </div>
        </div>
        <div className="lg:col-span-7">
          <h3 className="text-lg font-semibold">What I work on</h3>
          <dl className="mt-4 divide-y divide-border border-y border-border">
            {focus.map(([t, d]) => (
              <div key={t} className="grid gap-1 py-3.5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-6">
                <dt className="font-medium">{t}</dt>
                <dd className="text-[0.95rem] text-muted-foreground">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

export function Skills() {
  return (
    <section aria-labelledby="skills" className="border-b border-border">
      <div className="container-page py-16 md:py-20">
        <SectionHeading
          id="skills"
          title="Technical skills"
          intro="Grouped by where they sit in the pipeline. Where a project shows a tool in use, it is linked."
        />
        <div className="mt-10 divide-y divide-border border-y border-border">
          {skillGroups.map((g) => (
            <div key={g.group} className="grid gap-4 py-6 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-4">
                <h3 className="text-lg font-semibold">{g.group}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{g.summary}</p>
              </div>
              <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:col-span-8">
                {g.skills.map((s) => (
                  <li key={s.name} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-foreground">{s.name}</span>
                    {s.evidence?.map((e) => (
                      <Link
                        key={e.href + e.label}
                        href={e.href}
                        className="text-xs text-muted-foreground underline decoration-border underline-offset-4 hover:text-accent hover:decoration-accent"
                      >
                        {e.label}
                      </Link>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Experience() {
  return (
    <section aria-labelledby="experience" className="border-b border-border">
      <div className="container-page grid gap-12 py-16 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading id="experience" title="Experience" />
          <ol className="mt-8 space-y-10 border-l border-border pl-6">
            {experience.map((r) => (
              <li key={r.title + r.org} className="relative">
                <span aria-hidden className="absolute -left-[1.85rem] top-2 h-2.5 w-2.5 rounded-full border-2 border-accent bg-background" />
                <h3 className="text-xl font-semibold">{r.title}</h3>
                <p className="mt-1 text-foreground/85">
                  {r.org} · {r.location}
                </p>
                {r.period && <p className="mt-0.5 text-sm text-muted-foreground">{r.period}</p>}
                <p className="mt-3 text-[0.95rem] text-muted-foreground">{r.summary}</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.95rem] text-foreground/85 marker:text-accent">
                  {r.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-10 lg:col-span-5">
          <div>
            <h3 className="text-xl font-semibold">Education</h3>
            <ul className="mt-5 space-y-6">
              {education.map((e) => (
                <li key={e.title}>
                  <p className="font-medium">{e.title}</p>
                  <p className="text-foreground/85">{e.org}</p>
                  {e.period && <p className="text-sm text-muted-foreground">{e.period}</p>}
                  {e.note && <p className="mt-1 text-sm text-muted-foreground">{e.note}</p>}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Certifications</h3>
            <ul className="mt-4 space-y-1.5">
              {certifications.map((c) => (
                <li key={c.title} className="text-foreground/85">
                  {c.title} <span className="text-muted-foreground">— {c.issuer}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Supporting() {
  return (
    <section aria-labelledby="software" className="border-b border-border">
      <div className="container-page py-16 md:py-20">
        <SectionHeading
          id="software"
          title="Supporting AI and software work"
          intro="Web and AI projects that built the software skills behind the twins."
        />
        <ul className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {supportingProjects.map((p) => (
            <li key={p.title} className="border-t border-border pt-5">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-[0.95rem] text-muted-foreground">{p.description}</p>
              <p className="mt-3 text-sm text-foreground/80">{p.tech.join(', ')}</p>
              {p.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link mt-3 inline-flex items-center gap-1 text-sm">
                  {l.label}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function ContactDetails() {
  return (
    <ul className="space-y-4">
      <li>
        <a href={`mailto:${site.email}`} className="group inline-flex items-center gap-3">
          <Mail className="h-5 w-5 text-accent" aria-hidden />
          <span className="underline decoration-border underline-offset-4 group-hover:decoration-accent">{site.email}</span>
        </a>
      </li>
      <li>
        <a href={site.github} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3">
          <Github className="h-5 w-5 text-accent" aria-hidden />
          <span className="underline decoration-border underline-offset-4 group-hover:decoration-accent">
            github.com/{site.githubHandle}
          </span>
        </a>
      </li>
      {site.linkedin && (
        <li>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
            LinkedIn
          </a>
        </li>
      )}
      <li className="inline-flex items-center gap-3 text-muted-foreground">
        <MapPin className="h-5 w-5 text-accent" aria-hidden />
        {site.location}
      </li>
    </ul>
  )
}

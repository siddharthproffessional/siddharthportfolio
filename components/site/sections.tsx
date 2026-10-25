import Image from 'next/image'
import { ArrowUpRight, Github, Mail, MapPin, Phone } from 'lucide-react'
import { site } from '@/lib/site'
import { CAPABILITY, STATUS_LABEL, supportingProjects, workstreams, type Capability } from '@/lib/projects'
import { StatusDot } from './status'
import { Parallax, Reveal } from './motion'

export function SectionHeading({ id, title, intro, kicker }: { id: string; title: string; intro?: string; kicker?: string }) {
  return (
    <Reveal kind="rise" className="max-w-3xl">
      {kicker && <p className="annotation mb-4">{kicker}</p>}
      <h2 id={id} className="text-5xl sm:text-6xl lg:text-7xl">
        {title}
      </h2>
      {intro && <p className="mt-5 max-w-2xl text-[1.0625rem] text-muted-foreground">{intro}</p>}
    </Reveal>
  )
}

/** Explains the capability labels used on every project. */
export function CapabilityLegend() {
  const order: Capability[] = ['tested-simulation', 'interactive-app', 'software', 'blender-model', 'workflow']
  return (
    <details className="group mt-20 rounded-2xl border border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-medium hover:text-accent">
        How to read the capability labels
        <span className="annotation transition-transform duration-normal group-open:rotate-45">+</span>
      </summary>
      <dl className="grid gap-x-10 gap-y-5 border-t border-border p-5 text-sm sm:grid-cols-2">
        {order.map((c) => (
          <div key={c}>
            <dt className="font-medium">{CAPABILITY[c].label}</dt>
            <dd className="mt-1 text-muted-foreground">{CAPABILITY[c].description}</dd>
          </div>
        ))}
        <div>
          <dt className="font-medium">Live-data digital twin</dt>
          <dd className="mt-1 text-muted-foreground">Connected to real sensors or systems. None of the projects here claims this level.</dd>
        </div>
      </dl>
    </details>
  )
}

export function Workstreams() {
  return (
    <div className="mt-24">
      <Reveal kind="rise">
        <h3 className="text-4xl">Further workstreams</h3>
        <p className="mt-2 max-w-2xl text-muted-foreground">Related work that will get a full case study once its artifacts are published.</p>
      </Reveal>
      <ul className="mt-8 border-t border-border">
        {workstreams.map((w, i) => (
          <Reveal as="li" kind="focus" delay={i * 0.04} key={w.title} className="group grid gap-2 border-b border-border py-5 transition-colors hover:bg-white/[0.015] md:grid-cols-12 md:gap-6">
            <div className="md:col-span-4">
              <p className="font-medium">{w.title}</p>
              <p className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <StatusDot status={w.status} />
                {STATUS_LABEL[w.status]}
              </p>
            </div>
            <p className="text-[0.975rem] text-foreground/80 md:col-span-6">{w.description}</p>
            <p className="text-sm text-muted-foreground md:col-span-2">{w.evidence}</p>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}

export function About() {
  const focus = [
    ['3D scene preparation', 'Organising Blender and Revit content so it can be reused in real-time and simulation tools.'],
    ['BIM/USD interoperability', 'Moving scenes through OpenUSD into Unreal Engine, NVIDIA Omniverse and Isaac Sim, and documenting what breaks.'],
    ['Environmental visualization', 'Browser-based building twins with solar and surface-temperature scenarios.'],
    ['Spatial reconstruction', 'iPhone LiDAR/RoomPlan, 360° capture, COLMAP and Gaussian Splatting workflows.'],
    ['AI-assisted automation', 'Codex, Claude Code, Cursor and MCP integrations to script and test pipelines faster.'],
  ]
  return (
    <section aria-labelledby="about" className="border-t border-border">
      <div className="container-page grid gap-14 py-24 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal kind="scale" className="max-w-[22rem]">
            <Parallax amount={14} className="aspect-square rounded-full border border-border bg-[#e9e9e9]">
              <Image src="/siddharth-profile.webp" alt="Portrait of Siddharth Dialani" width={480} height={480} sizes="(min-width: 1024px) 384px, 80vw" className="h-full w-full object-cover" />
            </Parallax>
          </Reveal>
          <p className="annotation mt-4">{site.location}</p>
        </div>
        <div className="lg:col-span-7">
          <SectionHeading id="about" title="About" />
          <Reveal kind="rise" delay={0.1}>
            <p className="mt-8 font-display text-3xl leading-snug text-foreground sm:text-[2.35rem]">
              Digital-twin and simulation practitioner with an MBA focus in AI and Business Analytics.
            </p>
            <p className="prose-body mt-6">{site.summary}</p>
          </Reveal>
          <dl className="mt-12 border-t border-border">
            {focus.map(([t, d], i) => (
              <Reveal as="div" kind="focus" delay={i * 0.05} key={t} className="grid gap-1 border-b border-border py-4 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-8">
                <dt className="font-medium">{t}</dt>
                <dd className="text-[0.975rem] text-muted-foreground">{d}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

export function Supporting() {
  return (
    <section aria-labelledby="software" className="border-t border-border">
      <div className="container-page py-24 md:py-28">
        <SectionHeading id="software" title="Supporting software work" intro="AI and web projects from my existing portfolio that built the software skills behind the twins." />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
          {supportingProjects.map((p, i) => (
            <Reveal as="li" kind="scale" delay={i * 0.06} key={p.title} className="flex flex-col bg-background p-7">
              <h3 className="text-3xl">{p.title}</h3>
              <p className="mt-3 text-[0.975rem] text-muted-foreground">{p.description}</p>
              <p className="annotation mt-5">{p.tech.join(' · ')}</p>
              {p.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link mt-4 inline-flex items-center gap-1 text-sm">
                  {l.label}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              ))}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function ContactDetails() {
  const item = 'group flex items-center gap-4 border-b border-border py-4 text-[1.0625rem]'
  return (
    <ul>
      <li>
        <a href={`mailto:${site.email}`} className={item}>
          <Mail className="h-5 w-5 text-accent" aria-hidden />
          <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-accent">{site.email}</span>
        </a>
      </li>
      <li>
        <a href={site.phoneHref} className={item}>
          <Phone className="h-5 w-5 text-accent" aria-hidden />
          <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-accent">{site.phone}</span>
        </a>
      </li>
      <li>
        <a href={site.github} target="_blank" rel="noopener noreferrer" className={item}>
          <Github className="h-5 w-5 text-accent" aria-hidden />
          <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-accent">github.com/{site.githubHandle}</span>
          <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform duration-normal group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </a>
      </li>
      {site.linkedin && (
        <li>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={item}>
            LinkedIn
          </a>
        </li>
      )}
      <li className="flex items-center gap-4 py-4 text-muted-foreground">
        <MapPin className="h-5 w-5 text-accent" aria-hidden />
        {site.location}
      </li>
    </ul>
  )
}

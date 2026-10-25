import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { site, type ResumeAvailability } from '@/lib/site'
import { ResumeLinks } from './resume-links'

export function Hero({ resume }: { resume: ResumeAvailability }) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="grid-paper pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className="container-page relative grid gap-12 py-16 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-24">
        <div className="lg:col-span-6">
          <p className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-accent" aria-hidden />
            {site.location}
          </p>
          <h1 id="hero-title" className="text-[2.6rem] font-semibold leading-[1.02] sm:text-6xl lg:text-[4.1rem]">
            {site.name}
          </h1>
          <p className="mt-4 font-display text-xl font-medium text-foreground/85 [font-stretch:92%] sm:text-2xl">
            {site.title}
          </p>
          <p className="prose-body mt-6 text-muted-foreground">{site.statement}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
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
          </div>
        </div>

        <figure className="lg:col-span-6">
          <Link
            href="/projects/dubai-environmental-twin"
            className="group block overflow-hidden rounded-lg border border-border bg-card shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-border" />
              <span className="h-2 w-2 rounded-full bg-border" />
              <span className="h-2 w-2 rounded-full bg-border" />
              <span className="ml-3 truncate font-mono text-xs text-muted-foreground">ai-environmental-digital-twin.vercel.app</span>
            </div>
            <Image
              src="/projects/environmental-twin/overview.webp"
              alt="Dubai Environmental Digital Twin: a mid-rise building shaded by simulated surface temperature at 14:00, with condition and scenario panels."
              width={1600}
              height={1000}
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="h-auto w-full transition-transform duration-slow group-hover:scale-[1.01]"
            />
          </Link>
          <figcaption className="mt-3 text-sm text-muted-foreground">
            Screenshot from the Dubai Environmental Digital Twin, running from its own source. Values shown are simulated.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

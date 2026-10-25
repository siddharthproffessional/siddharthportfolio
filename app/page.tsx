import { Hero } from '@/components/site/hero'
import { ProcessStory } from '@/components/site/process-story'
import { Showcase } from '@/components/site/showcase'
import { ContactForm } from '@/components/site/contact-form'
import { SkillsTabs } from '@/components/site/skills-tabs'
import { Timeline } from '@/components/site/timeline'
import { ContactFinale } from '@/components/site/contact-finale'
import { EvidenceStrip, GlassPanel } from '@/components/site/motion'
import { About, CapabilityLegend, ContactDetails, SectionHeading, Supporting, Workstreams } from '@/components/site/sections'
import { ALL_CATEGORIES, ALL_TECH, projects } from '@/lib/projects'
import { site, siteUrl } from '@/lib/site'
import { getResume } from '@/lib/resume'

export default function Home() {
  const resume = getResume()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.shortTitle,
    address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
    email: `mailto:${site.email}`,
    url: siteUrl(),
    sameAs: [site.github, ...(site.linkedin ? [site.linkedin] : [])],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero resume={resume} />
      <EvidenceStrip />

      <section aria-labelledby="projects">
        <div className="container-page py-24 md:py-32">
          <SectionHeading
            id="projects"
            kicker="Selected work · 2026"
            title="Selected projects"
            intro="Digital-twin, simulation and interoperability work. Each project states its status, what kind of system it is, and how its content was verified."
          />
          <div className="mt-14">
            <Showcase projects={projects} categories={ALL_CATEGORIES} technologies={ALL_TECH} />
          </div>
          <CapabilityLegend />
          <Workstreams />
        </div>
      </section>

      <ProcessStory />
      <About />

      <section aria-labelledby="skills" className="border-t border-border">
        <div className="container-page py-24 md:py-32">
          <SectionHeading id="skills" title="Skills and technologies" intro="As listed on my resume, grouped the same way. Where a project shows a tool in use, it is linked." />
          <div className="mt-14">
            <SkillsTabs />
          </div>
        </div>
      </section>

      <section aria-labelledby="experience" className="border-t border-border">
        <div className="container-page py-24 md:py-32">
          <SectionHeading id="experience" title="Experience and education" />
          <div className="mt-16">
            <Timeline />
          </div>
        </div>
      </section>

      <Supporting />

      <ContactFinale resume={resume}>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ContactDetails />
          </div>
          <GlassPanel className="p-6 sm:p-8 lg:col-span-7">
            <ContactForm email={site.email} />
          </GlassPanel>
        </div>
      </ContactFinale>
    </>
  )
}

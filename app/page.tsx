import { Hero } from '@/components/site/hero'
import { WorkflowMap } from '@/components/site/workflow-map'
import { ProjectGallery } from '@/components/site/project-gallery'
import { ContactForm } from '@/components/site/contact-form'
import {
  About,
  CapabilityLegend,
  ContactDetails,
  Experience,
  SectionHeading,
  Skills,
  Supporting,
  Workstreams,
} from '@/components/site/sections'
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
      <WorkflowMap />

      <section aria-labelledby="projects" className="border-b border-border">
        <div className="container-page py-16 md:py-20">
          <SectionHeading
            id="projects"
            title="Selected projects"
            intro="Digital-twin, simulation and interoperability work. Each project states its status, what kind of system it is, and how its content was verified."
          />
          <div className="mt-8">
            <ProjectGallery projects={projects} categories={ALL_CATEGORIES} technologies={ALL_TECH} />
          </div>
          <CapabilityLegend />
          <Workstreams />
        </div>
      </section>

      <About />
      <Skills />
      <Experience />
      <Supporting />

      <section aria-labelledby="contact">
        <div className="container-page grid gap-12 py-16 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="contact"
              title="Contact"
              intro="Open to junior Digital Twin, Simulation, 3D Integration and Physical AI / robotics simulation roles in Dubai."
            />
            <div className="mt-8">
              <ContactDetails />
            </div>
          </div>
          <div className="lg:col-span-7">
            <ContactForm email={site.email} />
          </div>
        </div>
      </section>
    </>
  )
}

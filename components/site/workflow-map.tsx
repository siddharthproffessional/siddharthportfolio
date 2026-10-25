import Link from 'next/link'
import { getProject, type Status } from '@/lib/projects'
import { StatusDot } from './status'

type Stage = { name: string; does: string; tools: string[]; projects: string[] }

const SHORT: Record<string, string> = {
  'dubai-environmental-twin': 'Environmental twin',
  heatshield: 'HeatShield',
  'omniverse-intelligence-lab': 'Omniverse Intelligence Lab',
  'bottling-line-twin': 'Bottling-line twin',
  'simready-robotics-workflow': 'SimReady robotics',
  'blender-usd-unreal-omniverse': 'Blender → USD → Unreal',
}

/** The real sequence a digital-twin pipeline follows, with the projects that sit at each stage. */
const stages: Stage[] = [
  {
    name: 'Capture',
    does: 'Record real spaces as scans, photos and point clouds.',
    tools: ['iPhone LiDAR / RoomPlan', '360° capture', 'COLMAP', 'Gaussian splats'],
    projects: [],
  },
  {
    name: 'Model',
    does: 'Build and organise scenes, machinery and buildings.',
    tools: ['Blender', 'Revit'],
    projects: ['bottling-line-twin'],
  },
  {
    name: 'Interchange',
    does: 'Move scenes between tools without losing structure.',
    tools: ['OpenUSD', 'glTF', 'Blender Python'],
    projects: ['blender-usd-unreal-omniverse', 'omniverse-intelligence-lab'],
  },
  {
    name: 'Simulate',
    does: 'Add solar, thermal and physical behaviour.',
    tools: ['Thermal & solar models', 'Isaac Sim', 'Omniverse'],
    projects: ['heatshield', 'simready-robotics-workflow'],
  },
  {
    name: 'Deliver',
    does: 'Put the twin in front of people in a browser or engine.',
    tools: ['Three.js', 'Next.js', 'Unreal Engine', 'OpenXR'],
    projects: ['dubai-environmental-twin', 'heatshield'],
  },
]

export function WorkflowMap() {
  return (
    <section aria-labelledby="workflow-title" className="border-b border-border">
      <div className="container-page py-16 md:py-20">
        <div className="max-w-2xl">
          <h2 id="workflow-title" className="text-3xl font-semibold sm:text-4xl">
            Where each project sits in the pipeline
          </h2>
          <p className="mt-3 text-muted-foreground">
            A digital twin is a chain of tools. These are the stages I work across, the tools I use at each one, and the
            projects that show it.
          </p>
        </div>

        <div aria-hidden className="relative mt-10 hidden h-px overflow-hidden bg-border md:block">
          <span className="flow-pulse absolute inset-y-0 w-1/5 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>
        <ol className="relative mt-4 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:mt-3 md:grid-cols-5">
          {stages.map((s, i) => (
            <li key={s.name} className="flex flex-col bg-background p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-lg font-semibold">{s.name}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{s.does}</p>
              <ul className="mt-4 space-y-1 text-sm text-foreground/85">
                {s.tools.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div className="mt-auto pt-5">
                {s.projects.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Research-assistant work; case study in preparation.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {s.projects.map((slug) => {
                      const p = getProject(slug)
                      if (!p) return null
                      return (
                        <li key={slug}>
                          <Link href={`/projects/${slug}`} className="group inline-flex items-start gap-2 text-sm">
                            <span className="mt-[0.45rem]">
                              <StatusDot status={p.status as Status} />
                            </span>
                            <span className="text-foreground underline decoration-border underline-offset-4 group-hover:decoration-accent">
                              {SHORT[slug] ?? p.title}
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

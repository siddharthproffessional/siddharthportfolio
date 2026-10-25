'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { cn } from '@/lib/utils'
import { STORY_STAGES } from '@/lib/three/stages'

const DistrictCanvas = dynamic(() => import('./district-canvas'), { ssr: false })

type Step = { title: string; body: string; tools: string[]; where: { label: string; href: string }[] }

/** Tools listed per stage come from the resume; project links point to where the stage shows up. */
const STEPS: Step[] = [
  {
    title: 'Record the space',
    body: 'Scans, photos and depth capture become a point cloud — the raw material of a twin.',
    tools: ['iPhone LiDAR/RoomPlan', '360° capture', 'COLMAP', 'Gaussian Splatting', 'SuperSplat'],
    where: [{ label: 'Research assistant work', href: '#experience' }],
  },
  {
    title: 'Rebuild clean geometry',
    body: 'Edges, vertices and dimensions turn noisy capture into a model that can be measured and edited.',
    tools: ['Blender 5.2', 'Revit'],
    where: [{ label: 'Blender → USD → Unreal / Omniverse', href: '/projects/blender-usd-unreal-omniverse' }],
  },
  {
    title: 'Structure the scene',
    body: 'Floors, assets and hierarchy are organised so the scene survives the move between applications.',
    tools: ['OpenUSD/USD Bridge', 'USD exchange workflows', 'Python', 'MCP', 'Revit MCP'],
    where: [
      { label: 'Blender → USD → Unreal / Omniverse', href: '/projects/blender-usd-unreal-omniverse' },
      { label: 'SimReady robotics workflow', href: '/projects/simready-robotics-workflow' },
    ],
  },
  {
    title: 'Add behaviour',
    body: 'Sun position drives surface temperature; collision and physics are tested where the tools support them.',
    tools: ['NVIDIA Omniverse', 'Isaac Sim', 'Collision/physics testing'],
    where: [
      { label: 'Dubai Environmental Twin', href: '/projects/dubai-environmental-twin' },
      { label: 'HeatShield', href: '/projects/heatshield' },
    ],
  },
  {
    title: 'Put it in front of people',
    body: 'The result ships as an interactive browser or XR experience that people can question.',
    tools: ['Next.js', 'React', 'PlayCanvas', 'OpenXR', 'Meta Quest 3 PC Link', 'Vercel'],
    where: [
      { label: 'Dubai Environmental Twin', href: '/projects/dubai-environmental-twin' },
      { label: 'HeatShield', href: '/projects/heatshield' },
    ],
  },
]

export function ProcessStory() {
  const listRef = useRef<HTMLOListElement>(null)
  const progress = useRef(0)
  const [active, setActive] = useState(0)
  // Progress runs 0 → 1 while the list of steps passes the middle of the viewport,
  // so each equal-height step maps onto one fifth of the scene timeline.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start center', 'end center'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    progress.current = v
  })

  return (
    <section id="process" aria-labelledby="process-title" className="relative">
      <div className="lg:grid lg:grid-cols-12">
        {/* Sticky 3D stage */}
        <div className="sticky top-16 z-10 h-[44svh] border-b border-border bg-background lg:order-2 lg:col-span-7 lg:h-[calc(100svh-4rem)] lg:border-b-0 lg:border-l">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_45%,hsl(var(--violet)/0.08),transparent_70%)]" />
          <DistrictCanvas mode="story" progress={progress} onStage={setActive} className="absolute inset-0" />
          <div className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 lg:left-6 lg:top-6">
            <span className="annotation !text-foreground">
              {String(active + 1).padStart(2, '0')} / 05 · {STORY_STAGES[active]}
            </span>
          </div>
          <p className="annotation absolute bottom-3 right-4 lg:bottom-6 lg:right-6">Concept visualization — illustrative district, not project data</p>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5">
            <div className="h-full bg-accent transition-[width] duration-normal" style={{ width: `${((active + 1) / 5) * 100}%` }} />
          </div>
        </div>

        {/* Steps */}
        <div className="relative lg:order-1 lg:col-span-5">
          <div className="container-page lg:pl-10 lg:pr-12">
            <div className="pb-4 pt-16 lg:pt-28">
              <h2 id="process-title" className="text-5xl sm:text-6xl">
                From scan to simulation
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                The pipeline my work sits in. Scroll to move the scene through each stage; the tools listed are the ones I use there.
              </p>
            </div>
            <ol ref={listRef}>
              {STEPS.map((s, i) => (
                <li
                  key={s.title}
                  className={cn('flex min-h-[72svh] flex-col justify-center py-10 transition-opacity duration-slow lg:min-h-[88svh]', active === i ? 'opacity-100' : 'opacity-35')}
                >
                  <p className="annotation flex items-center gap-3">
                    <span className="text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <span className="h-px w-10 bg-border" aria-hidden />
                    {STORY_STAGES[i]}
                  </p>
                  <h3 className="mt-4 text-4xl">{s.title}</h3>
                  <p className="mt-3 max-w-md text-foreground/80">{s.body}</p>
                  <ul className="mt-5 flex max-w-md flex-wrap gap-2">
                    {s.tools.map((t) => (
                      <li key={t} className="rounded-full border border-border px-3 py-1 text-sm text-foreground/85">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-5 space-y-1.5 text-sm">
                    {s.where.map((w) => (
                      <li key={w.href + w.label}>
                        <Link href={w.href} className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-accent">
                          {w.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

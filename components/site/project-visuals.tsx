'use client'

import Image from 'next/image'
import { motion} from 'framer-motion'
import { Box } from 'lucide-react'
import type { Project } from '@/lib/projects'
import { cn } from '@/lib/utils'
import { EASE, Parallax, useReduced } from './motion'

/** Label shown on every visual that is not real project media. */
function ConceptTag({ children = 'Concept visual — not project media' }: { children?: React.ReactNode }) {
  return <span className="annotation absolute bottom-3 left-3 z-10 rounded-full border border-white/10 bg-background/80 px-2.5 py-1 backdrop-blur">{children}</span>
}

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('group/visual relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-card', className)}>{children}</div>
}

/** Environmental twin: parallax screenshot; hovering reveals the Combined scenario capture. */
function HeatmapVisual({ p }: { p: Project }) {
  const [a, b] = p.media
  return (
    <Frame>
      <Parallax amount={26} className="absolute inset-0">
        <Image src={a.src} alt={a.alt} width={a.width} height={a.height} sizes="(min-width: 1024px) 720px, 100vw" className="h-full w-full object-cover object-left-top" />
      </Parallax>
      {b && (
        <Image
          src={b.src}
          alt={b.alt}
          width={b.width}
          height={b.height}
          sizes="(min-width: 1024px) 720px, 100vw"
          className="absolute inset-0 h-full w-full object-cover object-left-top opacity-0 transition-opacity duration-slow ease-out group-hover/visual:opacity-100"
        />
      )}
      <span className="annotation absolute bottom-3 left-3 rounded-full border border-white/10 bg-background/80 px-2.5 py-1 backdrop-blur">
        <span className="group-hover/visual:hidden">Existing scenario · hover for Combined</span>
        <span className="hidden group-hover/visual:inline">Combined scenario · roof view</span>
      </span>
    </Frame>
  )
}

/** HeatShield: two real captures layered in depth, separating on hover. */
function ModelVisual({ p }: { p: Project }) {
  const [a, b] = p.media
  return (
    <Frame className="[perspective:1400px]">
      <div className="absolute inset-0 transition-transform duration-slow ease-out [transform-style:preserve-3d] group-hover/visual:[transform:rotateX(6deg)_rotateY(-8deg)]">
        <Image src={a.src} alt={a.alt} width={a.width} height={a.height} sizes="(min-width: 1024px) 720px, 100vw" className="absolute inset-0 h-full w-full object-cover object-left-top" />
        {b && (
          <div className="absolute bottom-[8%] right-[5%] w-[46%] overflow-hidden rounded-lg border border-white/15 shadow-2xl transition-transform duration-slow ease-out [transform:translateZ(30px)] group-hover/visual:[transform:translateZ(90px)_translateY(-6px)]">
            <Image src={b.src} alt={b.alt} width={b.width} height={b.height} sizes="340px" className="h-auto w-full" />
          </div>
        )}
      </div>
      <span className="annotation absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-background/85 px-2.5 py-1 !text-foreground backdrop-blur">
        <Box className="h-3.5 w-3.5 text-accent" aria-hidden />
        Real 3D model available to inspect
      </span>
    </Frame>
  )
}

/** SimReady: assets flowing into a USD stage and on to Isaac Sim — all dashed because it is planned. */
function AssetFlowVisual() {
  const reduce = useReduced()
  const paths = ['M150 92 C 250 92, 250 200, 330 200', 'M150 200 L 330 200', 'M150 308 C 250 308, 250 200, 330 200', 'M470 200 L 540 200']
  return (
    <Frame className="grid-paper">
      <svg viewBox="0 0 640 400" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="af-g" x1="0" x2="1">
            <stop offset="0" stopColor="hsl(var(--accent))" />
            <stop offset="1" stopColor="hsl(var(--violet))" />
          </linearGradient>
        </defs>
        {[92, 200, 308].map((y, i) => (
          <g key={y} transform={`translate(40 ${y - 34})`}>
            <rect width="110" height="68" rx="10" fill="hsl(var(--card))" stroke="hsl(var(--status-explore) / .7)" strokeDasharray="5 4" />
            <g transform="translate(18 18)" stroke="hsl(var(--foreground) / .7)" fill="none" strokeWidth="1.3">
              <path d="M16 2 28 9v14l-12 7-12-7V9z" />
              <path d="M4 9l12 7 12-7M16 16v14" opacity=".5" />
            </g>
            <text x="58" y="39" fill="hsl(var(--muted-foreground))" fontSize="12" fontFamily="var(--font-mono)">
              asset_{i + 1}
            </text>
          </g>
        ))}
        {paths.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="url(#af-g)"
            strokeWidth="1.6"
            strokeDasharray="6 6"
            initial={{ strokeDashoffset: 0 }}
            animate={reduce ? undefined : { strokeDashoffset: -48 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
          />
        ))}
        <g transform="translate(330 140)">
          {[0, 1, 2].map((k) => (
            <rect key={k} x={k * 6} y={k * 10} width="128" height="100" rx="10" fill="hsl(var(--card))" stroke="hsl(var(--status-explore) / .6)" strokeDasharray="5 4" opacity={1 - k * 0.25} />
          ))}
          <text x="22" y="62" fill="hsl(var(--foreground))" fontSize="14" fontFamily="var(--font-mono)">
            stage.usd
          </text>
        </g>
        <g transform="translate(540 160)">
          <rect width="72" height="80" rx="10" fill="hsl(var(--card))" stroke="hsl(var(--status-explore) / .6)" strokeDasharray="5 4" />
          <text x="11" y="45" fill="hsl(var(--muted-foreground))" fontSize="11" fontFamily="var(--font-mono)">
            Isaac Sim
          </text>
        </g>
      </svg>
      <ConceptTag>Concept visual — planned workflow</ConceptTag>
    </Frame>
  )
}

/** Interop: three axis triads showing each tool's conventions; they turn on hover. */
function AxesVisual() {
  const triads = [
    { name: 'Blender', note: 'Z-up · metres', up: 'Z', upColor: 'bg-accent', depth: 'Y', depthColor: 'bg-[#6CCB8B]' },
    { name: 'USD stage', note: 'upAxis + metersPerUnit set per stage', up: 'Y/Z', upColor: 'bg-violet', depth: 'Z/Y', depthColor: 'bg-white/40' },
    { name: 'Unreal Engine', note: 'Z-up · centimetres', up: 'Z', upColor: 'bg-accent', depth: 'Y', depthColor: 'bg-[#6CCB8B]' },
  ]
  return (
    <Frame className="grid-paper">
      <div className="absolute inset-0 grid grid-cols-3 items-center px-4 [perspective:900px]">
        {triads.map((t, i) => (
          <div key={t.name} className="flex flex-col items-center gap-5">
            <div
              className="relative h-28 w-28 [transform-style:preserve-3d] [transform:rotateX(-22deg)_rotateY(-38deg)] motion-safe:transition-transform motion-safe:duration-[1400ms] motion-safe:ease-out group-hover/visual:[transform:rotateX(-22deg)_rotateY(142deg)]"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <span className="absolute left-1/2 top-1/2 h-0.5 w-14 origin-left bg-[#E86B5F]" />
              <span className={cn('absolute left-1/2 top-1/2 h-0.5 w-14 origin-left [transform:rotateZ(-90deg)]', t.upColor)} />
              <span className={cn('absolute left-1/2 top-1/2 h-0.5 w-14 origin-left [transform:rotateY(-90deg)]', t.depthColor)} />
              <span className="annotation absolute left-[calc(50%+3.6rem)] top-[calc(50%-0.5rem)]">X</span>
              <span className="annotation absolute left-[calc(50%-0.5rem)] top-[calc(50%-4.8rem)] !text-foreground">{t.up}</span>
              <span className="annotation absolute left-1/2 top-1/2 [transform:rotateY(-90deg)_translateX(3.8rem)]">{t.depth}</span>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{t.name}</p>
              <p className="annotation mt-0.5">{t.note}</p>
            </div>
          </div>
        ))}
      </div>
      <div aria-hidden className="absolute left-[33%] right-[33%] top-[42%] flex justify-between px-2">
        <span className="h-px w-[40%] bg-gradient-to-r from-transparent to-accent/60" />
        <span className="h-px w-[40%] bg-gradient-to-r from-accent/60 to-transparent" />
      </div>
      <ConceptTag>Reference conventions — hover to turn</ConceptTag>
    </Frame>
  )
}

/** Omniverse lab: an illustrative USD prim hierarchy that draws itself into view. */
function UsdTreeVisual() {
  const reduce = useReduced()
  const rows = [
    { d: 0, t: '/World' },
    { d: 1, t: 'Looks' },
    { d: 1, t: 'Geometry' },
    { d: 2, t: 'Building' },
    { d: 2, t: 'Equipment' },
    { d: 1, t: 'Lights' },
    { d: 1, t: 'Physics' },
  ]
  return (
    <Frame className="grid-paper">
      <div className="absolute inset-0 flex items-center px-[10%]">
        <ul className="w-full max-w-sm space-y-2 font-mono text-sm">
          {rows.map((r, i) => (
            <motion.li
              key={r.t}
              initial={reduce ? false : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.5, delay: 0.12 * i, ease: EASE }}
              className="flex items-center gap-2"
              style={{ paddingLeft: `${r.d * 1.6}rem` }}
            >
              {r.d > 0 && <span className="h-px w-4 bg-border" aria-hidden />}
              <span className={cn('rounded-md border px-2.5 py-1', r.t === 'Building' ? 'border-accent/60 bg-accent/10 text-foreground' : 'border-border bg-card text-foreground/80')}>
                {r.t}
              </span>
              {r.t === 'Building' && <span className="annotation text-accent">← tool call</span>}
            </motion.li>
          ))}
        </ul>
      </div>
      <ConceptTag>Concept visual — illustrative USD hierarchy</ConceptTag>
    </Frame>
  )
}

/** Bottling line: an isometric conveyor sketch; bottles advance while the card is hovered. */
function ConveyorVisual() {
  return (
    <Frame className="grid-paper">
      <svg viewBox="0 0 640 400" className="absolute inset-0 h-full w-full" aria-hidden>
        <g transform="translate(80 120)">
          {/* belt */}
          <path d="M0 150 L360 -30 L440 10 L80 190 Z" fill="hsl(var(--card))" stroke="hsl(var(--foreground) / .35)" />
          <path d="M80 190 L80 206 L440 26 L440 10" fill="none" stroke="hsl(var(--foreground) / .2)" />
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1={20 + i * 40} y1={160 - i * 20} x2={100 + i * 40} y2={200 - i * 20} stroke="hsl(var(--foreground) / .12)" />
          ))}
          {/* filler machine */}
          <g transform="translate(200 -40)">
            <path d="M0 40 L60 10 L120 40 L60 70 Z" fill="hsl(var(--secondary))" stroke="hsl(var(--foreground) / .4)" />
            <path d="M0 40 L0 110 L60 140 L60 70 Z" fill="hsl(var(--card))" stroke="hsl(var(--foreground) / .35)" />
            <path d="M120 40 L120 110 L60 140 L60 70 Z" fill="hsl(var(--background))" stroke="hsl(var(--foreground) / .35)" />
          </g>
        </g>
        <g className="conveyor-bottles">
          {Array.from({ length: 6 }).map((_, i) => (
            <g key={i} transform={`translate(${130 + i * 62} ${262 - i * 31})`}>
              <rect x="-7" y="-34" width="14" height="30" rx="5" fill="hsl(var(--accent) / .25)" stroke="hsl(var(--accent))" />
              <rect x="-3" y="-42" width="6" height="9" rx="2" fill="hsl(var(--accent))" />
            </g>
          ))}
        </g>
      </svg>
      <style>{`
        .conveyor-bottles { transition: transform 1.6s var(--ease-in-out); }
        .group\\/visual:hover .conveyor-bottles { transform: translate(62px, -31px); }
        @media (prefers-reduced-motion: reduce) { .group\\/visual:hover .conveyor-bottles { transform: none; } }
      `}</style>
      <ConceptTag>Concept visual — renders not yet published</ConceptTag>
    </Frame>
  )
}

export function ProjectVisual({ project }: { project: Project }) {
  switch (project.visual) {
    case 'heatmap':
      return <HeatmapVisual p={project} />
    case 'model':
      return <ModelVisual p={project} />
    case 'asset-flow':
      return <AssetFlowVisual />
    case 'axes':
      return <AxesVisual />
    case 'usd-tree':
      return <UsdTreeVisual />
    case 'conveyor':
      return <ConveyorVisual />
  }
}

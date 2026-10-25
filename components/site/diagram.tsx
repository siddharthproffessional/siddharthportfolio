'use client'

import { useMemo, useState } from 'react'
import { Maximize2, Copy, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import type { Diagram as DiagramData, DiagramNode } from '@/lib/projects'

const NODE_W = 208
const NODE_H = 76
const COL_GAP = 60
const ROW_GAP = 18
const PAD = 12

function wrap(text: string, max = 30): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max && line) {
      lines.push(line)
      line = w
    } else line = (line + ' ' + w).trim()
  }
  if (line) lines.push(line)
  return lines.slice(0, 2)
}

function layout(d: DiagramData) {
  const tallest = Math.max(...d.columns.map((c) => c.length))
  const height = tallest * NODE_H + (tallest - 1) * ROW_GAP + PAD * 2
  const width = d.columns.length * NODE_W + (d.columns.length - 1) * COL_GAP + PAD * 2
  const pos = new Map<string, { x: number; y: number; node: DiagramNode }>()
  d.columns.forEach((col, ci) => {
    const colH = col.length * NODE_H + (col.length - 1) * ROW_GAP
    const top = (height - colH) / 2
    col.forEach((node, ri) => {
      pos.set(node.id, { x: PAD + ci * (NODE_W + COL_GAP), y: top + ri * (NODE_H + ROW_GAP), node })
    })
  })
  return { width, height, pos }
}

/** Mermaid source generated from the same data, so the diagram stays editable outside the site. */
export function toMermaid(d: DiagramData): string {
  const lines = ['flowchart LR']
  d.columns.flat().forEach((n) => {
    const label = n.detail ? `${n.label}<br/><small>${n.detail}</small>` : n.label
    lines.push(`  ${n.id}${n.planned ? '([' : '['}"${label.replace(/"/g, "'")}"${n.planned ? '])' : ']'}`)
  })
  d.edges.forEach(([a, b]) => lines.push(`  ${a} --> ${b}`))
  const planned = d.columns.flat().filter((n) => n.planned)
  if (planned.length) {
    lines.push('  classDef planned stroke-dasharray: 5 5')
    lines.push(`  class ${planned.map((n) => n.id).join(',')} planned`)
  }
  return lines.join('\n')
}

function DiagramSvg({ data, compact = false, titleId }: { data: DiagramData; compact?: boolean; titleId?: string }) {
  const { width, height, pos } = useMemo(() => layout(data), [data])
  const markerId = `arrow-${titleId ?? 'thumb'}`
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role={compact ? undefined : 'img'}
      aria-hidden={compact ? true : undefined}
      aria-labelledby={compact ? undefined : titleId}
      className="h-auto w-full"
    >
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" fill="hsl(var(--muted-foreground))" />
        </marker>
      </defs>
      {data.edges.map(([a, b]) => {
        const s = pos.get(a)
        const t = pos.get(b)
        if (!s || !t) return null
        const x1 = s.x + NODE_W
        const y1 = s.y + NODE_H / 2
        const x2 = t.x - 4
        const y2 = t.y + NODE_H / 2
        const mid = (x1 + x2) / 2
        const dashed = s.node.planned || t.node.planned
        return (
          <path
            key={`${a}-${b}`}
            d={`M${x1} ${y1} C${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`}
            fill="none"
            stroke="hsl(var(--muted-foreground) / 0.7)"
            strokeWidth={1.4}
            strokeDasharray={dashed ? '5 5' : undefined}
            markerEnd={`url(#${markerId})`}
          />
        )
      })}
      {Array.from(pos.values()).map(({ x, y, node }) => {
        const detail = node.detail ? wrap(node.detail) : []
        return (
          <g key={node.id} transform={`translate(${x} ${y})`}>
            <rect
              width={NODE_W}
              height={NODE_H}
              rx={6}
              fill={node.planned ? 'hsl(var(--background))' : 'hsl(var(--card))'}
              stroke={node.planned ? 'hsl(var(--status-explore) / 0.8)' : 'hsl(var(--accent) / 0.65)'}
              strokeWidth={1.3}
              strokeDasharray={node.planned ? '5 4' : undefined}
            />
            {!compact && (
              <>
                <text x={14} y={detail.length ? 27 : 43} fill="hsl(var(--foreground))" fontSize={14} fontWeight={600} fontFamily="var(--font-sans)">
                  {node.label}
                </text>
                {detail.map((line, i) => (
                  <text key={i} x={14} y={47 + i * 16} fill="hsl(var(--muted-foreground))" fontSize={12} fontFamily="var(--font-sans)">
                    {line}
                  </text>
                ))}
              </>
            )}
            {compact && (
              <>
                <rect x={14} y={24} width={NODE_W * 0.55} height={9} rx={3} fill="hsl(var(--foreground) / 0.5)" />
                <rect x={14} y={42} width={NODE_W * 0.7} height={7} rx={3} fill="hsl(var(--muted-foreground) / 0.35)" />
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export function DiagramThumb({ data }: { data: DiagramData }) {
  return (
    <div className="grid-paper flex aspect-[16/10] items-center bg-background p-6">
      <DiagramSvg data={data} compact />
    </div>
  )
}

export function Diagram({ data, id }: { data: DiagramData; id: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const mermaid = useMemo(() => toMermaid(data), [data])
  const titleId = `diagram-${id}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(mermaid)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <figure className="overflow-hidden rounded-lg border border-border">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <figcaption id={titleId} className="font-medium">
          {data.title}
        </figcaption>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent/60 hover:text-accent"
        >
          <Maximize2 className="h-4 w-4" aria-hidden />
          Expand diagram
        </button>
      </div>
      <div className="grid-paper overflow-x-auto bg-background p-4">
        <div className="min-w-[640px]">
          <DiagramSvg data={data} titleId={titleId} />
        </div>
      </div>
      <p className="border-t border-border px-4 pt-3 text-xs text-muted-foreground sm:hidden">Scroll sideways, or expand the diagram.</p>
      {data.note && <p className="border-t border-border px-4 py-3 text-sm text-muted-foreground">{data.note}</p>}
      <details className="group border-t border-border">
        <summary className="cursor-pointer px-4 py-3 text-sm text-muted-foreground hover:text-foreground">
          Diagram source (Mermaid)
        </summary>
        <div className="relative px-4 pb-4">
          <button
            type="button"
            onClick={copy}
            className="absolute right-6 top-2 inline-flex items-center gap-1.5 rounded border border-border bg-card px-2 py-1 text-xs hover:text-accent"
          >
            {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <pre className="overflow-x-auto rounded-md bg-card p-4 pr-20 font-mono text-xs leading-relaxed text-foreground/85">
            <code>{mermaid}</code>
          </pre>
        </div>
      </details>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-[min(96vw,1200px)] overflow-auto border-border bg-background p-4 sm:p-6">
          <DialogTitle className="pr-8 font-display text-xl">{data.title}</DialogTitle>
          <DialogDescription className="sr-only">Enlarged system diagram. Scroll horizontally on small screens.</DialogDescription>
          <div className="grid-paper overflow-x-auto rounded-md border border-border p-4">
            <div className="min-w-[900px]">
              <DiagramSvg data={data} titleId={`${titleId}-lg`} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </figure>
  )
}

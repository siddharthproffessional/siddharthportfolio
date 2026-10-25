import { NextResponse } from 'next/server'
import { site } from '@/lib/site'
import { CAPABILITY, STATUS_LABEL, projects, supportingProjects, workstreams } from '@/lib/projects'
import { certifications, education, experience, skillGroups } from '@/lib/profile'
import { clientKey, rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const API_URL = 'https://apps.abacus.ai/v1/chat/completions'

/** The assistant's knowledge is generated from the same data the site renders, so it cannot drift. */
function systemPrompt(): string {
  const proj = projects
    .map((p) => {
      const done = p.implemented.map((i) => `    - ${i.text}${i.verified ? '' : ' [owner-reported, not yet verified]'}`).join('\n')
      const planned = (p.planned ?? []).map((x) => `    - PLANNED (not built): ${x}`).join('\n')
      const limits = p.limitations.map((x) => `    - ${x}`).join('\n')
      return `- ${p.title} — status: ${STATUS_LABEL[p.status]}${p.statusNote ? ` (${p.statusNote})` : ''}; capability: ${CAPABILITY[p.capability].label}. ${p.tagline}
  Implemented:
${done || '    - Nothing published yet.'}
${planned}
  Limitations:
${limits}
  Links: ${p.links.map((l) => `${l.label}: ${l.href}`).join(', ') || 'none public'}; page: /projects/${p.slug}`
    })
    .join('\n')

  return `You are the assistant on ${site.name}'s portfolio website. Answer questions about him using ONLY the facts below. Be concise (2–4 sentences), plain and professional.

Rules:
- Never invent projects, employers, dates, credentials, metrics or integrations.
- Keep capability levels exact: a Blender model is not a simulation; simulated values are not live data; nothing here is connected to live sensors.
- Mark owner-reported or planned items as such when you mention them.
- If something is not covered below, say you don't have that information and suggest the contact form or ${site.email}.
- Politely decline unrelated requests.

PROFILE
Name: ${site.name}. Title: ${site.title}. Location: ${site.location}.
Summary: ${site.summary}
Email: ${site.email}. GitHub: ${site.github}.

EXPERIENCE
${experience.map((r) => `- ${r.title}, ${r.org}${r.period ? ` (${r.period})` : ''}: ${r.summary} ${r.points.join(' ')}`).join('\n')}

EDUCATION
${education.map((e) => `- ${e.title}, ${e.org}${e.period ? ` (${e.period})` : ''}. ${e.note}`).join('\n')}
Certifications: ${certifications.map((c) => `${c.title} (${c.issuer})`).join(', ')}

SKILLS (no proficiency levels claimed)
${skillGroups.map((g) => `- ${g.group}: ${g.skills.map((s) => s.name).join(', ')}`).join('\n')}

SELECTED PROJECTS
${proj}

FURTHER WORKSTREAMS (no full case study yet)
${workstreams.map((w) => `- ${w.title} (${STATUS_LABEL[w.status]}): ${w.description}`).join('\n')}

SUPPORTING AI & SOFTWARE PROJECTS
${supportingProjects.map((s) => `- ${s.title}: ${s.description} (${s.tech.join(', ')})`).join('\n')}`
}

export async function GET() {
  return NextResponse.json({ enabled: Boolean(process.env.ABACUSAI_API_KEY) })
}

type InMsg = { role?: unknown; content?: unknown }

export async function POST(req: Request) {
  const key = process.env.ABACUSAI_API_KEY
  if (!key) return NextResponse.json({ error: 'not_configured' }, { status: 503 })
  if (!rateLimit(`chat:${clientKey(req)}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: { messages?: InMsg[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  // Only user/assistant turns are accepted from the browser; the system prompt is server-side.
  const history = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m): m is { role: 'user' | 'assistant'; content: string } => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))

  if (!history.length || history[history.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'no_question' }, { status: 400 })
  }

  try {
    const upstream = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.ABACUSAI_MODEL || 'gpt-5.4-mini',
        messages: [{ role: 'system', content: systemPrompt() }, ...history],
        stream: true,
        max_tokens: 500,
        temperature: 0.3,
      }),
    })
    if (!upstream.ok || !upstream.body) {
      console.error('Chat upstream error:', upstream.status)
      return NextResponse.json({ error: 'upstream_failed' }, { status: 502 })
    }
    return new Response(upstream.body, {
      headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform' },
    })
  } catch (err) {
    console.error('Chat error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'upstream_failed' }, { status: 502 })
  }
}

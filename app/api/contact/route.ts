import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPool } from '@/lib/db'
import { clientKey, rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const schema = z.object({
  name: z.string().trim().min(1, 'Enter your name.').max(100, 'Use 100 characters or fewer.'),
  email: z.string().trim().email('Enter an email address like name@company.com.').max(200),
  subject: z.string().trim().max(150, 'Use 150 characters or fewer.').optional().default(''),
  message: z.string().trim().min(10, 'Write at least 10 characters.').max(5000, 'Use 5,000 characters or fewer.'),
  company: z.string().optional().default(''), // honeypot
})

export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientKey(req)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const fields: Record<string, string> = {}
    for (const issue of parsed.error.issues) fields[String(issue.path[0])] ??= issue.message
    return NextResponse.json({ error: 'invalid', fields }, { status: 400 })
  }

  const { name, email, subject, message, company } = parsed.data
  // Bots fill the hidden field; accept silently so they learn nothing.
  if (company) return NextResponse.json({ success: true })

  const pool = getPool()
  if (!pool) {
    return NextResponse.json({ error: 'not_configured', fallback: 'email' }, { status: 503 })
  }

  try {
    await pool.query(
      'INSERT INTO "ContactSubmission" ("id","name","email","subject","message","status","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())',
      [randomUUID(), name, email, subject || 'General enquiry', message, 'NEW'],
    )
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form storage error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'storage_failed', fallback: 'email' }, { status: 500 })
  }
}

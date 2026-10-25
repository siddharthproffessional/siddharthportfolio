export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request?.json?.()
    const name = body?.name?.trim?.() ?? ''
    const email = body?.email?.trim?.() ?? ''
    const subject = body?.subject?.trim?.() ?? 'General Inquiry'
    const message = body?.message?.trim?.() ?? ''

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    const submission = await prisma.contactSubmission.create({
      data: { name, email, subject, message },
    })

    return NextResponse.json({ success: true, id: submission?.id ?? '' })
  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const count = await prisma.contactSubmission.count()
    return NextResponse.json({ count })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

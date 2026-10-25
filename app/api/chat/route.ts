export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'

const SYSTEM_PROMPT = `You are Siddharth Dialani's AI portfolio assistant. You answer questions about Siddharth professionally and concisely.

KEY INFORMATION ABOUT SIDDHARTH DIALANI:
- AI Engineer based in Dubai, UAE
- Pursuing MBA in Business Analytics & Artificial Intelligence at Middlesex University Dubai
- Bachelor of Computer Applications from BYK College of Commerce
- Certifications: Python (Basic), SQL (Basic) from HackerRank
- Philosophy: "I don't write code without AI. I build intelligent systems that solve real-world problems."

PROJECTS:
1. ATLAS AI - Financial Intelligence Platform: AI-powered market intelligence with Anthropic Claude, autonomous portfolio monitoring, paper trading, Three.js visualizations, AWS, Docker, PostgreSQL
2. AI Website Development: Claude Code workflow, Cursor, AI-reviewed code, production deployment, Vercel, GitHub CI/CD
3. Interactive 3D Earth News Platform: Real-time News API, Three.js 3D Globe, geographical news visualization
4. Jarvis Business OS: Autonomous AI Agents, WhatsApp Business API, Telegram approval workflows, n8n, Anthropic API, human-in-the-loop

SKILLS:
- AI Development: Claude Code, Cursor, OpenAI Codex, ChatGPT, Gemini, GitHub Copilot
- LLMs: Claude, GPT-5, Gemini, Grok, Qwen, Kimi
- Programming: JavaScript, Node.js, Express, TypeScript, Python
- Automation: n8n, AI Agents, Workflow Automation
- Backend: REST APIs, PostgreSQL, Redis
- Deployment: Docker, AWS, Vercel, GitHub CI/CD
- Visualization: Three.js, 3D Graphics

SERVICES: AI Automation, AI Agents, Workflow Automation, Business Analytics, AI Dashboards, LLM Applications, Custom AI Software, Full Stack Development

Keep answers brief (2-4 sentences), professional, and enthusiastic. If asked about things not related to Siddharth, politely redirect.`

export async function POST(request: NextRequest) {
  try {
    const body = await request?.json?.()
    const userMessages = body?.messages ?? []

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(userMessages?.map?.((m: any) => ({
        role: m?.role ?? 'user',
        content: m?.content ?? '',
      })) ?? []),
    ]

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages,
        stream: true,
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response?.ok) {
      const errorText = await response?.text?.() ?? 'Unknown error'
      console.error('LLM API error:', errorText)
      return new Response(JSON.stringify({ error: 'LLM API request failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response?.body?.getReader?.()
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()
        try {
          if (reader) {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              const chunk = decoder.decode(value)
              controller.enqueue(encoder.encode(chunk))
            }
          }
        } catch (error: any) {
          console.error('Stream error:', error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

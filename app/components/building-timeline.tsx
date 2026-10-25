'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Rocket, BarChart3, Globe, Bot, Cpu, Zap } from 'lucide-react'

const timelineItems = [
  {
    title: 'ATLAS AI Financial Intelligence',
    period: '2025 - Present',
    description: 'Built AI-powered market intelligence platform with autonomous portfolio monitoring and paper trading. Production-deployed with Anthropic Claude, Three.js, AWS, Docker.',
    icon: BarChart3,
    tags: ['Claude API', 'Three.js', 'AWS', 'Docker'],
  },
  {
    title: 'Jarvis Business OS',
    period: '2025',
    description: 'Developed autonomous AI agent system with WhatsApp Business and Telegram integration. Human-in-the-loop approval workflows for critical business decisions.',
    icon: Bot,
    tags: ['AI Agents', 'n8n', 'WhatsApp API'],
  },
  {
    title: 'AI-First Website Development',
    period: '2025',
    description: 'Pioneered AI-first development workflow using Claude Code and Cursor. Production deployment with automated CI/CD and AI-reviewed code quality.',
    icon: Cpu,
    tags: ['Claude Code', 'Cursor', 'CI/CD'],
  },
  {
    title: '3D Earth News Platform',
    period: '2024',
    description: 'Created interactive 3D globe for geographical news visualization using Three.js and real-time News API integration.',
    icon: Globe,
    tags: ['Three.js', 'WebGL', 'News API'],
  },
]

export default function BuildingTimeline() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="building" className="relative py-32" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-mono tracking-wider uppercase">Journey</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mt-3">
            Building <span className="text-gradient">AI Products</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">A timeline of shipping production AI systems.</p>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent" />

          {timelineItems?.map?.((item: any, i: number) => {
            const Icon = item?.icon
            const isLeft = i % 2 === 0
            return (
              <motion.div
                key={item?.title ?? i}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                className={`relative mb-12 last:mb-0 pl-16 md:pl-0 ${
                  isLeft ? 'md:pr-[calc(50%+2rem)] md:text-right' : 'md:pl-[calc(50%+2rem)]'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-2 w-5 h-5 rounded-full border-2 border-emerald-500 bg-emerald-500/20 z-10">
                  <div className="absolute inset-1 rounded-full bg-emerald-400" />
                </div>

                <div className="glass-card rounded-xl p-6 hover:bg-white/[0.04] transition-all">
                  <div className={`flex items-center gap-2 mb-3 ${isLeft ? 'md:justify-end' : ''}`}>
                    <div className="p-1.5 rounded-lg bg-emerald-500/10">
                      {Icon ? <Icon className="w-4 h-4 text-emerald-400" /> : null}
                    </div>
                    <span className="text-xs font-mono text-gray-500">{item?.period ?? ''}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">{item?.title ?? ''}</h3>
                  <p className="text-sm text-gray-400 mb-3">{item?.description ?? ''}</p>
                  <div className={`flex flex-wrap gap-1.5 ${isLeft ? 'md:justify-end' : ''}`}>
                    {item?.tags?.map?.((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-white/5 text-gray-500">{tag}</span>
                    )) ?? []}
                  </div>
                </div>
              </motion.div>
            )
          }) ?? []}
        </div>
      </div>
    </section>
  )
}

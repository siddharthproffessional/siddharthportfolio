'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const techItems = [
  { name: 'Claude', category: 'AI' },
  { name: 'GPT', category: 'AI' },
  { name: 'Gemini', category: 'AI' },
  { name: 'JavaScript', category: 'Lang' },
  { name: 'TypeScript', category: 'Lang' },
  { name: 'Node.js', category: 'Runtime' },
  { name: 'Express', category: 'Framework' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Redis', category: 'Database' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'AWS', category: 'Cloud' },
  { name: 'Vercel', category: 'Cloud' },
  { name: 'GitHub', category: 'DevOps' },
  { name: 'Three.js', category: 'Viz' },
  { name: 'n8n', category: 'Automation' },
  { name: 'OpenAI', category: 'AI' },
  { name: 'Anthropic', category: 'AI' },
  { name: 'Cursor', category: 'AI' },
  { name: 'Next.js', category: 'Framework' },
  { name: 'React', category: 'Framework' },
]

const categoryColors: Record<string, string> = {
  AI: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Lang: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  Runtime: 'text-green-400 bg-green-500/10 border-green-500/20',
  Framework: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Database: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  DevOps: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  Cloud: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  Viz: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  Automation: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
}

export default function TechStack() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="tech-stack" className="relative py-32" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-mono tracking-wider uppercase">Stack</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mt-3">
            Tech <span className="text-gradient">Arsenal</span>
          </h2>
        </motion.div>

        {/* Animated marquee rows */}
        <div className="space-y-4 overflow-hidden">
          {[0, 1].map((row: number) => {
            const items = row === 0 ? techItems?.slice?.(0, 10) ?? [] : techItems?.slice?.(10) ?? []
            const doubled = [...(items ?? []), ...(items ?? [])]
            return (
              <motion.div
                key={row}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: row * 0.2 }}
                className="flex gap-3"
              >
                <div className={`flex gap-3 animate-marquee ${row === 1 ? 'animate-marquee-reverse' : ''}`}
                  style={{
                    animation: `${row === 1 ? 'marquee-reverse' : 'marquee'} ${row === 1 ? '35s' : '40s'} linear infinite`,
                  }}
                >
                  {doubled?.map?.((tech: any, i: number) => {
                    const colorClass = categoryColors?.[tech?.category ?? ''] ?? 'text-gray-400 bg-white/5 border-white/10'
                    return (
                      <div
                        key={`${tech?.name}-${i}`}
                        className={`flex-shrink-0 px-5 py-3 rounded-xl border ${colorClass} font-display text-sm font-medium hover:scale-105 transition-transform cursor-default`}
                      >
                        {tech?.name ?? ''}
                      </div>
                    )
                  }) ?? []}
                </div>
              </motion.div>
            )
          })}
        </div>

        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}</style>
      </div>
    </section>
  )
}

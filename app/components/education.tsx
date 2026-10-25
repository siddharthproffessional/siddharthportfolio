'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GraduationCap, Calendar, MapPin } from 'lucide-react'

const education = [
  {
    degree: 'MBA in Business Analytics & Artificial Intelligence',
    institution: 'Middlesex University Dubai',
    location: 'Dubai, UAE',
    period: 'Current',
    description: 'Pursuing advanced studies combining business analytics with artificial intelligence, focusing on AI-driven decision-making and autonomous systems.',
    highlight: true,
  },
  {
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'BYK College of Commerce',
    location: 'India',
    period: 'Completed',
    description: 'Foundational education in computer science, programming, and software development, building the technical base for AI engineering.',
    highlight: false,
  },
]

export default function Education() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="education" className="relative py-32" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent" />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-mono tracking-wider uppercase">Education</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mt-3">
            Academic <span className="text-gradient">Journey</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent" />

            {education?.map?.((edu: any, i: number) => (
              <motion.div
                key={edu?.degree ?? i}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                className="relative pl-16 pb-12 last:pb-0"
              >
                {/* Timeline dot */}
                <div className={`absolute left-4 top-1 w-5 h-5 rounded-full border-2 ${edu?.highlight ? 'border-emerald-400 bg-emerald-400/20' : 'border-gray-600 bg-gray-800'}`}>
                  {edu?.highlight && <div className="absolute inset-1 rounded-full bg-emerald-400 animate-pulse" />}
                </div>

                <div className="glass-card rounded-xl p-6 hover:bg-white/[0.04] transition-all">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                    </div>
                    {edu?.highlight && (
                      <span className="px-2.5 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Current
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-1">{edu?.degree ?? ''}</h3>
                  <p className="text-emerald-400 text-sm font-medium mb-2">{edu?.institution ?? ''}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{edu?.location ?? ''}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{edu?.period ?? ''}</span>
                  </div>
                  <p className="text-sm text-gray-400">{edu?.description ?? ''}</p>
                </div>
              </motion.div>
            )) ?? []}
          </div>
        </div>
      </div>
    </section>
  )
}

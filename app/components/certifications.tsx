'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Award, ExternalLink, CheckCircle } from 'lucide-react'

const certifications = [
  { name: 'Python (Basic)', issuer: 'HackerRank', icon: '🐍', verified: true },
  { name: 'SQL (Basic)', issuer: 'HackerRank', icon: '🗄️', verified: true },
]

export default function Certifications() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="certifications" className="relative py-32" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-mono tracking-wider uppercase">Credentials</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mt-3">
            <span className="text-gradient">Certifications</span>
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certifications?.map?.((cert: any, i: number) => (
            <motion.div
              key={cert?.name ?? i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="glass-card rounded-xl p-6 hover:bg-white/[0.06] transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{cert?.icon ?? ''}</div>
                {cert?.verified && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400">Verified</span>
                  </div>
                )}
              </div>
              <h3 className="font-display text-base font-semibold text-white mb-1">{cert?.name ?? ''}</h3>
              <p className="text-sm text-gray-500">{cert?.issuer ?? ''}</p>
            </motion.div>
          )) ?? []}
        </div>
      </div>
    </section>
  )
}

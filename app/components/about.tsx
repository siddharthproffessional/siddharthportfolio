'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Brain, Code2, Rocket, MapPin, GraduationCap, Zap } from 'lucide-react'

const highlights = [
  { icon: Brain, label: 'AI-First Development', desc: 'Every line of code is written with AI assistance' },
  { icon: Code2, label: 'Claude Code & Cursor', desc: 'Primary development environments for rapid shipping' },
  { icon: Rocket, label: 'Production Systems', desc: 'Building and deploying real-world AI solutions' },
  { icon: Zap, label: 'Autonomous AI', desc: 'Specializing in AI agents and autonomous systems' },
]

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="about" className="relative py-32">
      <div className="max-w-[1200px] mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-mono tracking-wider uppercase">About Me</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mt-3">
            AI Engineer & <span className="text-gradient">Builder</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card rounded-2xl p-8 space-y-5">
              <p className="text-gray-300 leading-relaxed text-lg">
                I'm an AI Engineer based in <span className="text-emerald-400 inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Dubai, UAE</span>, pursuing an MBA in Business Analytics & Artificial Intelligence at Middlesex University Dubai.
              </p>
              <p className="text-gray-400 leading-relaxed">
                With a Bachelor of Computer Applications from BYK College of Commerce and a deep passion for AI, I specialize in building production-ready AI systems using Claude Code and Cursor as my primary development environments.
              </p>
              <p className="text-gray-400 leading-relaxed">
                My approach is radically AI-first — I leverage LLMs not just as tools, but as core development partners. From autonomous financial intelligence platforms to business automation systems with human-in-the-loop workflows, I ship products that solve real problems at production scale.
              </p>
              <p className="text-gray-400 leading-relaxed">
                I work across the full stack with a focus on autonomous AI systems, intelligent agents, and financial intelligence — combining business analytics expertise with cutting-edge AI engineering.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights?.map?.((item: any, i: number) => {
              const Icon = item?.icon
              return (
                <motion.div
                  key={item?.label ?? i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="glass-card rounded-xl p-6 hover:bg-white/[0.06] transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition-colors">
                    {Icon ? <Icon className="w-5 h-5 text-emerald-400" /> : null}
                  </div>
                  <h3 className="font-display text-sm font-semibold text-white mb-1">{item?.label ?? ''}</h3>
                  <p className="text-xs text-gray-500">{item?.desc ?? ''}</p>
                </motion.div>
              )
            }) ?? []}
          </div>
        </div>
      </div>
    </section>
  )
}

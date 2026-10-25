'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Bot, Workflow, BarChart3, Monitor, Brain, Layers, Code2, Cpu } from 'lucide-react'

const services = [
  { title: 'AI Automation', desc: 'End-to-end AI automation solutions for business processes', icon: Bot, color: 'from-emerald-500 to-green-500' },
  { title: 'AI Agents', desc: 'Autonomous AI agents with human-in-the-loop oversight', icon: Brain, color: 'from-purple-500 to-indigo-500' },
  { title: 'Workflow Automation', desc: 'Intelligent workflow automation using n8n and custom AI', icon: Workflow, color: 'from-cyan-500 to-blue-500' },
  { title: 'Business Analytics', desc: 'Data-driven insights and analytics dashboards', icon: BarChart3, color: 'from-amber-500 to-orange-500' },
  { title: 'AI Dashboards', desc: 'Real-time AI-powered monitoring and analytics', icon: Monitor, color: 'from-pink-500 to-rose-500' },
  { title: 'LLM Applications', desc: 'Custom applications built on large language models', icon: Cpu, color: 'from-teal-500 to-emerald-500' },
  { title: 'Custom AI Software', desc: 'Bespoke AI solutions tailored to specific business needs', icon: Layers, color: 'from-violet-500 to-purple-500' },
  { title: 'Full Stack Dev', desc: 'Modern full-stack development with AI-first approach', icon: Code2, color: 'from-orange-500 to-red-500' },
]

export default function Services() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="services" className="relative py-32" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-mono tracking-wider uppercase">What I Offer</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mt-3">
            <span className="text-gradient">Services</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Turning complex AI challenges into production-ready solutions.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services?.map?.((svc: any, i: number) => {
            const Icon = svc?.icon
            return (
              <motion.div
                key={svc?.title ?? i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="glass-card rounded-xl p-6 hover:bg-white/[0.06] transition-all group text-center"
              >
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${svc?.color ?? ''} flex items-center justify-center mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`}>
                  {Icon ? <Icon className="w-6 h-6 text-white" /> : null}
                </div>
                <h3 className="font-display text-sm font-semibold text-white mb-2">{svc?.title ?? ''}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{svc?.desc ?? ''}</p>
              </motion.div>
            )
          }) ?? []}
        </div>
      </div>
    </section>
  )
}

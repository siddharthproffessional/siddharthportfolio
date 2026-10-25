'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Brain, Code, Server, Workflow, Cloud, BarChart3, Users, Eye } from 'lucide-react'

const skillCategories = [
  {
    title: 'AI Development',
    icon: Brain,
    color: 'from-emerald-500 to-green-500',
    skills: ['Claude Code', 'Cursor', 'OpenAI Codex', 'ChatGPT', 'Gemini', 'GitHub Copilot'],
  },
  {
    title: 'LLMs & Models',
    icon: Eye,
    color: 'from-purple-500 to-indigo-500',
    skills: ['Claude', 'GPT-5', 'Gemini', 'Grok', 'Qwen', 'Kimi'],
  },
  {
    title: 'Programming',
    icon: Code,
    color: 'from-yellow-500 to-orange-500',
    skills: ['JavaScript', 'Node.js', 'Express', 'TypeScript', 'Python'],
  },
  {
    title: 'Automation',
    icon: Workflow,
    color: 'from-cyan-500 to-blue-500',
    skills: ['n8n', 'AI Agents', 'Workflow Automation', 'WhatsApp API', 'Telegram API'],
  },
  {
    title: 'Backend & Data',
    icon: Server,
    color: 'from-pink-500 to-rose-500',
    skills: ['REST APIs', 'PostgreSQL', 'Redis', 'Database Design'],
  },
  {
    title: 'Deployment',
    icon: Cloud,
    color: 'from-teal-500 to-emerald-500',
    skills: ['Docker', 'AWS', 'Vercel', 'GitHub CI/CD', 'Production Deploy'],
  },
  {
    title: 'Visualization',
    icon: BarChart3,
    color: 'from-amber-500 to-yellow-500',
    skills: ['Three.js', 'Data Visualization', '3D Graphics', 'Interactive UI'],
  },
  {
    title: 'Soft Skills',
    icon: Users,
    color: 'from-violet-500 to-purple-500',
    skills: ['Business Analytics', 'Problem Solving', 'Product Thinking', 'Team Leadership'],
  },
]

export default function Skills() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="skills" className="relative py-32" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-mono tracking-wider uppercase">Expertise</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mt-3">
            Skills & <span className="text-gradient">Technologies</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">A comprehensive toolkit spanning AI development, full-stack engineering, and business analytics.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillCategories?.map?.((cat: any, i: number) => {
            const Icon = cat?.icon
            return (
              <motion.div
                key={cat?.title ?? i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card rounded-xl p-6 hover:bg-white/[0.06] transition-all group"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat?.color ?? ''} flex items-center justify-center mb-4 opacity-80 group-hover:opacity-100 transition-opacity`}>
                  {Icon ? <Icon className="w-5 h-5 text-white" /> : null}
                </div>
                <h3 className="font-display text-base font-semibold text-white mb-3">{cat?.title ?? ''}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat?.skills?.map?.((skill: string) => (
                    <span key={skill} className="px-2.5 py-1 text-xs rounded-md bg-white/5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                      {skill}
                    </span>
                  )) ?? []}
                </div>
              </motion.div>
            )
          }) ?? []}
        </div>
      </div>
    </section>
  )
}

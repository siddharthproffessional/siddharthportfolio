'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, Github, FileText, ChevronDown, ChevronUp, Cpu, Globe, Bot, BarChart3 } from 'lucide-react'

const projects = [
  {
    id: 'atlas-ai',
    title: 'ATLAS AI',
    subtitle: 'Financial Intelligence Platform',
    icon: BarChart3,
    gradient: 'from-emerald-500 to-teal-500',
    problem: 'Financial markets generate overwhelming data. Traders and analysts need real-time, AI-powered insights to make informed decisions without manual research bottlenecks.',
    solution: 'Built a comprehensive AI-powered market intelligence platform integrating Anthropic Claude for autonomous portfolio monitoring, paper trading simulations, and real-time financial analytics.',
    architecture: 'Full-stack application with Three.js 3D visualizations, PostgreSQL for data persistence, AWS cloud infrastructure, and Docker containerized deployment. Features autonomous AI agents for continuous market monitoring.',
    techStack: ['Anthropic Claude', 'Three.js', 'PostgreSQL', 'AWS', 'Docker', 'Node.js', 'REST APIs'],
    challenges: 'Handling real-time financial data streams, implementing reliable paper trading logic, and building autonomous AI agents that can monitor portfolios without human intervention.',
    outcome: 'Production-deployed platform capable of autonomous portfolio monitoring, AI-driven market analysis, and paper trading with real-time performance tracking.',
    tags: ['AI', 'Finance', 'Full Stack', 'Production'],
  },
  {
    id: 'ai-website',
    title: 'AI Website Development',
    subtitle: 'Claude Code Workflow Platform',
    icon: Cpu,
    gradient: 'from-purple-500 to-indigo-500',
    problem: 'Traditional web development is slow and error-prone. Modern AI tools can dramatically accelerate the development lifecycle while maintaining code quality.',
    solution: 'Developed a complete website using Claude Code as the primary development workflow, with Cursor for AI-reviewed code, production deployment pipelines, and automated CI/CD.',
    architecture: 'Modern web application with AI-assisted development workflow. GitHub CI/CD pipeline for automated testing and deployment to Vercel. AI-reviewed pull requests for code quality.',
    techStack: ['Claude Code', 'Cursor', 'Vercel', 'GitHub CI/CD', 'Next.js', 'TypeScript'],
    challenges: 'Establishing reliable AI-assisted development workflows, ensuring AI-reviewed code meets production standards, and building efficient CI/CD pipelines.',
    outcome: 'Successfully shipped production website with 100% AI-assisted development, demonstrating the viability of AI-first development workflows.',
    tags: ['AI Development', 'DevOps', 'Production'],
  },
  {
    id: '3d-earth-news',
    title: 'Interactive 3D Earth News',
    subtitle: 'Geographical News Visualization',
    icon: Globe,
    gradient: 'from-cyan-500 to-blue-500',
    problem: 'News consumption lacks geographical context. Understanding where events happen globally is crucial for informed decision-making.',
    solution: 'Created an interactive 3D globe platform that visualizes real-time news events on a three-dimensional Earth model, providing geographical context to global news.',
    architecture: 'Three.js-powered 3D globe with real-time News API integration. Events are plotted geographically on the globe with interactive tooltips and filtering capabilities.',
    techStack: ['Three.js', 'News API', '3D Graphics', 'JavaScript', 'WebGL', 'REST APIs'],
    challenges: 'Rendering performant 3D graphics in the browser, geocoding news events accurately, and creating intuitive user interactions with a 3D interface.',
    outcome: 'Delivered an engaging, interactive news platform that transforms how users consume and understand global news through geographical visualization.',
    tags: ['3D', 'Visualization', 'API Integration'],
  },
  {
    id: 'jarvis-business-os',
    title: 'Jarvis Business OS',
    subtitle: 'Autonomous AI Agent System',
    icon: Bot,
    gradient: 'from-orange-500 to-red-500',
    problem: 'Businesses struggle with repetitive operational tasks. Manual workflows create bottlenecks and limit scalability.',
    solution: 'Built an autonomous AI agent system with WhatsApp Business API and Telegram integration, featuring human-in-the-loop approval workflows for critical business decisions.',
    architecture: 'Node.js/Express backend with n8n workflow automation, Anthropic API for AI decision-making, WhatsApp Business API for customer interactions, and Telegram for admin approvals.',
    techStack: ['Node.js', 'Express', 'n8n', 'Anthropic API', 'WhatsApp Business API', 'Telegram API', 'AI Agents'],
    challenges: 'Designing reliable human-in-the-loop workflows, ensuring AI agent safety with approval mechanisms, and integrating multiple messaging platforms seamlessly.',
    outcome: 'Deployed autonomous business automation system that handles customer interactions, automates workflows, and includes human oversight for critical decisions.',
    tags: ['AI Agents', 'Automation', 'Business'],
  },
]

export default function Projects() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <section id="projects" className="relative py-32" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-mono tracking-wider uppercase">Portfolio</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mt-3">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Production-deployed AI systems solving real-world problems.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects?.map?.((project: any, i: number) => {
            const Icon = project?.icon
            const isExpanded = expanded === project?.id
            return (
              <motion.div
                key={project?.id ?? i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="glass-card rounded-2xl overflow-hidden group hover:bg-white/[0.04] transition-all"
              >
                {/* Header gradient bar */}
                <div className={`h-1 bg-gradient-to-r ${project?.gradient ?? ''}`} />
                
                <div className="p-7">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${project?.gradient ?? ''} flex items-center justify-center`}>
                        {Icon ? <Icon className="w-5 h-5 text-white" /> : null}
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-white">{project?.title ?? ''}</h3>
                        <p className="text-sm text-gray-500">{project?.subtitle ?? ''}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{project?.problem ?? ''}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project?.tags?.map?.((tag: string) => (
                      <span key={tag} className="px-2.5 py-0.5 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {tag}
                      </span>
                    )) ?? []}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 pt-4 border-t border-white/5">
                          <div>
                            <h4 className="text-xs font-mono text-emerald-400 uppercase mb-1">Solution</h4>
                            <p className="text-gray-400 text-sm">{project?.solution ?? ''}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-mono text-emerald-400 uppercase mb-1">Architecture</h4>
                            <p className="text-gray-400 text-sm">{project?.architecture ?? ''}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-mono text-emerald-400 uppercase mb-1">Challenges</h4>
                            <p className="text-gray-400 text-sm">{project?.challenges ?? ''}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-mono text-emerald-400 uppercase mb-1">Outcome</h4>
                            <p className="text-gray-400 text-sm">{project?.outcome ?? ''}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-mono text-emerald-400 uppercase mb-2">Tech Stack</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {project?.techStack?.map?.((tech: string) => (
                                <span key={tech} className="px-2.5 py-1 text-xs rounded-md bg-white/5 text-gray-300">{tech}</span>
                              )) ?? []}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <button
                      onClick={() => setExpanded(isExpanded ? null : (project?.id ?? null))}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-400 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {isExpanded ? 'Less' : 'Case Study'}
                    </button>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all" aria-label="GitHub">
                        <Github className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all" aria-label="Demo">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
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

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Download, FolderOpen, Mail, MessageSquare } from 'lucide-react'
import Image from 'next/image'

const typingTexts = [
  'Building AI Agents',
  'Shipping Production AI',
  'Full Stack AI Developer',
  'Claude Code Expert',
  'Cursor AI Developer',
  'LLM Engineer',
]

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const currentText = typingTexts?.[textIndex] ?? ''

  const tick = useCallback(() => {
    if (isDeleting) {
      setCharIndex((prev: number) => Math.max(prev - 1, 0))
      if (charIndex <= 1) {
        setIsDeleting(false)
        setTextIndex((prev: number) => (prev + 1) % (typingTexts?.length ?? 1))
      }
    } else {
      setCharIndex((prev: number) => prev + 1)
      if (charIndex >= (currentText?.length ?? 0)) {
        setTimeout(() => setIsDeleting(true), 2000)
        return
      }
    }
  }, [charIndex, isDeleting, currentText, textIndex])

  useEffect(() => {
    if (!mounted) return
    const speed = isDeleting ? 40 : 80
    const timer = setTimeout(tick, speed)
    return () => clearTimeout(timer)
  }, [tick, isDeleting, mounted])

  const displayText = currentText?.slice?.(0, charIndex) ?? ''

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView?.({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-900/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-800/15 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-950/30 blur-[150px]" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">Available for AI Engineering Roles</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white mb-4"
            >
              Hi, I'm{' '}
              <span className="text-gradient">Siddharth</span>.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-12 md:h-14 mb-6"
            >
              <span className="font-display text-2xl md:text-3xl font-medium text-gray-300">
                {mounted ? displayText : typingTexts?.[0] ?? ''}
                <span className="inline-block w-[2px] h-6 md:h-8 bg-emerald-400 ml-1 animate-pulse" />
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-gray-400 max-w-xl mb-10 leading-relaxed"
            >
              I don't write code without AI. I build{' '}
              <span className="text-emerald-400 font-medium">intelligent systems</span>{' '}
              that solve real-world problems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <button
                onClick={() => scrollTo('#projects')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-emerald-500/20 flex items-center gap-2"
              >
                <FolderOpen className="w-4 h-4" />
                View Projects
              </button>
              <button
                onClick={() => scrollTo('#contact')}
                className="px-6 py-3 glass-card text-white rounded-lg font-medium transition-all hover:bg-white/10 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Let's Talk
              </button>
              <button
                onClick={() => scrollTo('#contact')}
                className="px-6 py-3 glass-card text-emerald-400 rounded-lg font-medium transition-all hover:bg-white/10 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Hire Me
              </button>
            </motion.div>
          </div>

          {/* Profile image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-900/30 blur-2xl" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 p-[2px]">
                <div className="w-full h-full rounded-full overflow-hidden bg-background">
                  <Image
                    src="/siddharth-profile.jpg"
                    alt="Siddharth Dialani - AI Engineer"
                    fill
                    className="object-cover rounded-full"
                    priority
                  />
                </div>
              </div>
              {/* Orbiting dots */}
              <div className="absolute inset-[-20px] animate-spin-slow">
                <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="absolute inset-[-30px] animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '25s' }}>
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-300/60" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <button onClick={() => scrollTo('#about')} className="text-gray-500 hover:text-emerald-400 transition-colors animate-bounce">
            <ArrowDown className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

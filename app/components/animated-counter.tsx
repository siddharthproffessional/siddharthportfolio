'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FolderOpen, Code2, Cpu, Rocket } from 'lucide-react'

const stats = [
  { label: 'AI Projects Shipped', value: 4, suffix: '+', icon: FolderOpen },
  { label: 'Technologies Mastered', value: 20, suffix: '+', icon: Code2 },
  { label: 'LLMs Integrated', value: 6, suffix: '+', icon: Cpu },
  { label: 'Systems Deployed', value: 4, suffix: '', icon: Rocket },
]

function Counter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return <>{count}</>
}

export default function AnimatedCounter() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="relative py-24" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats?.map?.((stat: any, i: number) => {
            const Icon = stat?.icon
            return (
              <motion.div
                key={stat?.label ?? i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 text-center group hover:bg-white/[0.06] transition-all"
              >
                <div className="w-10 h-10 mx-auto rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                  {Icon ? <Icon className="w-5 h-5 text-emerald-400" /> : null}
                </div>
                <div className="font-display text-3xl font-bold text-white">
                  {inView ? <Counter target={stat?.value ?? 0} /> : 0}
                  <span className="text-emerald-400">{stat?.suffix ?? ''}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat?.label ?? ''}</p>
              </motion.div>
            )
          }) ?? []}
        </div>
      </div>
    </section>
  )
}

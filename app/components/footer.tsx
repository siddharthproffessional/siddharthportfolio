'use client'

import { Sparkles } from 'lucide-react'

export default function Footer() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView?.({ behavior: 'smooth' })
  }

  return (
    <footer className="relative py-12 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display text-sm font-semibold text-white">Siddharth Dialani</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => scrollTo('#about')} className="text-xs text-gray-500 hover:text-emerald-400 transition-colors">About</button>
            <button onClick={() => scrollTo('#projects')} className="text-xs text-gray-500 hover:text-emerald-400 transition-colors">Projects</button>
            <button onClick={() => scrollTo('#contact')} className="text-xs text-gray-500 hover:text-emerald-400 transition-colors">Contact</button>
          </div>

          <p className="text-xs text-gray-600">
            Built with AI. Powered by passion.
          </p>
        </div>
      </div>
    </footer>
  )
}

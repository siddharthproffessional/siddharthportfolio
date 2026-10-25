'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView?.({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => scrollTo('#hero')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight text-white">SD</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navLinks?.map?.((link: any) => (
              <button
                key={link?.href}
                onClick={() => scrollTo(link?.href)}
                className="px-4 py-2 text-sm text-gray-200 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {link?.label}
              </button>
            )) ?? []}
            <button
              onClick={() => scrollTo('#contact')}
              className="ml-3 px-5 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-emerald-500/20"
            >
              Hire Me
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks?.map?.((link: any) => (
                <button
                  key={link?.href}
                  onClick={() => scrollTo(link?.href)}
                  className="text-left text-xl text-gray-300 hover:text-white py-3 border-b border-white/5 transition-colors"
                >
                  {link?.label}
                </button>
              )) ?? []}
              <button
                onClick={() => scrollTo('#contact')}
                className="mt-4 w-full py-3 bg-emerald-600 text-white rounded-lg font-medium"
              >
                Hire Me
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Send, MapPin, Mail, Phone, Github, Linkedin, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function Contact() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form?.name?.trim() || !form?.email?.trim() || !form?.message?.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res?.ok) throw new Error('Failed to send')
      setSent(true)
      toast.success('Message sent successfully!')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err: any) {
      toast.error(err?.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="relative py-32" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-mono tracking-wider uppercase">Get In Touch</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mt-3">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Interested in AI engineering collaboration? Let's discuss how intelligent systems can solve your challenges.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-display text-lg font-semibold text-white mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm text-white">Dubai, UAE</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-white">siddharthdialani@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Github className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">GitHub</p>
                    <p className="text-sm text-white">github.com/siddharth-dialani</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Linkedin className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">LinkedIn</p>
                    <p className="text-sm text-white">linkedin.com/in/siddharth-dialani</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3 className="font-display text-base font-semibold text-white mb-2">Open to Opportunities</h3>
              <p className="text-sm text-gray-400">Currently exploring AI engineering roles and freelance AI automation projects. Open to full-time positions, contract work, and exciting collaborations in the AI space.</p>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {sent ? (
              <div className="glass-card rounded-xl p-12 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-400 text-sm">Thank you for reaching out. I'll get back to you soon.</p>
                <button onClick={() => setSent(false)} className="mt-6 px-5 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card rounded-xl p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-medium">Name *</label>
                    <input
                      type="text"
                      value={form?.name ?? ''}
                      onChange={(e: any) => setForm((prev: any) => ({ ...(prev ?? {}), name: e?.target?.value ?? '' }))}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-medium">Email *</label>
                    <input
                      type="email"
                      value={form?.email ?? ''}
                      onChange={(e: any) => setForm((prev: any) => ({ ...(prev ?? {}), email: e?.target?.value ?? '' }))}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Subject</label>
                  <input
                    type="text"
                    value={form?.subject ?? ''}
                    onChange={(e: any) => setForm((prev: any) => ({ ...(prev ?? {}), subject: e?.target?.value ?? '' }))}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Message *</label>
                  <textarea
                    value={form?.message ?? ''}
                    onChange={(e: any) => setForm((prev: any) => ({ ...(prev ?? {}), message: e?.target?.value ?? '' }))}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none"
                    placeholder="Tell me about your project or opportunity..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
                <p className="text-xs text-gray-600 text-center">Your message is stored securely and I'll respond within 24 hours.</p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

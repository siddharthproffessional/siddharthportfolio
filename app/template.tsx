'use client'

import { motion } from 'framer-motion'
import { useReduced } from '@/components/site/motion'

/** Route transition: each page fades and settles into place on navigation. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReduced()
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={reduce ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

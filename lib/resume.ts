import fs from 'fs'
import path from 'path'
import type { ResumeAvailability } from './site'

/**
 * Resume files are served from /public/resume. The download control only appears
 * for files that actually exist, so the site never links to a missing resume.
 */
export const RESUME_FILES = {
  pdf: 'Siddharth-Dialani-Resume.pdf',
  docx: 'Siddharth-Dialani-Resume.docx',
} as const

export function getResume(): ResumeAvailability {
  const dir = path.join(process.cwd(), 'public', 'resume')
  const has = (f: string) => {
    try {
      return fs.statSync(path.join(dir, f)).size > 0
    } catch {
      return false
    }
  }
  return {
    pdf: has(RESUME_FILES.pdf) ? `/resume/${RESUME_FILES.pdf}` : null,
    docx: has(RESUME_FILES.docx) ? `/resume/${RESUME_FILES.docx}` : null,
  }
}


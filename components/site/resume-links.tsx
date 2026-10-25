import { Download, FileText, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { resumeRequestHref, type ResumeAvailability } from '@/lib/site'

/**
 * Serves the real resume files when they exist in /public/resume.
 * Until then the control honestly becomes a resume request by email.
 */
export function ResumeLinks({
  resume,
  variant = 'secondary',
  className,
}: {
  resume: ResumeAvailability
  variant?: 'secondary' | 'compact'
  className?: string
}) {
  const base =
    variant === 'compact'
      ? 'inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:border-accent/60 hover:text-accent transition-colors'
      : 'inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-[0.95rem] font-medium text-foreground hover:border-accent/60 hover:text-accent transition-colors'

  if (!resume.pdf && !resume.docx) {
    return (
      <a href={resumeRequestHref()} className={cn(base, className)}>
        <Mail className="h-4 w-4" aria-hidden />
        Request resume
      </a>
    )
  }

  return (
    <span className={cn('inline-flex flex-wrap items-center gap-2', className)}>
      {resume.pdf && (
        <a href={resume.pdf} download className={base}>
          <Download className="h-4 w-4" aria-hidden />
          Download resume
          {variant === 'secondary' && <span className="text-muted-foreground">PDF</span>}
        </a>
      )}
      {resume.docx && variant === 'secondary' && (
        <a
          href={resume.docx}
          download
          className="inline-flex items-center gap-1.5 px-2 py-2.5 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          <FileText className="h-4 w-4" aria-hidden />
          Word copy
        </a>
      )}
    </span>
  )
}

import { cn } from '@/lib/utils'
import { STATUS_LABEL, type Status } from '@/lib/projects'

const dot: Record<Status, string> = {
  completed: 'bg-status-complete',
  'in-progress': 'bg-status-progress',
  exploration: 'bg-status-explore',
}

const text: Record<Status, string> = {
  completed: 'text-status-complete',
  'in-progress': 'text-status-progress',
  exploration: 'text-status-explore',
}

/** Status is shown as a coloured dot plus a text label, so colour never carries meaning alone. */
export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm font-medium', text[status], className)}>
      <span aria-hidden className={cn('h-2 w-2 rounded-full', dot[status])} />
      {STATUS_LABEL[status]}
    </span>
  )
}

export function StatusDot({ status }: { status: Status }) {
  return <span aria-hidden className={cn('inline-block h-2 w-2 shrink-0 rounded-full', dot[status])} />
}

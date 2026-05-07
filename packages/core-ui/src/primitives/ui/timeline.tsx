import * as React from 'react'

import { cn } from '../../lib/utils'

type TimelineStatus = 'completed' | 'pending'

type TimelineItemProps = {
  label: string
  timestamp: string
  status?: TimelineStatus
}

type TimelineProps = React.ComponentProps<'div'> & {
  title?: string
  items: TimelineItemProps[]
}

function Timeline({ title, items, ...props }: TimelineProps) {
  return (
    <div data-slot="timeline" {...props}>
      {title && (
        <p className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {title}
        </p>
      )}
      <ol className="flex flex-col gap-0">
        {items.map((item, index) => (
          <TimelineItem key={index} {...item} isLast={index === items.length - 1} />
        ))}
      </ol>
    </div>
  )
}

function TimelineItem({
  label,
  timestamp,
  status = 'pending',
  isLast = false,
}: TimelineItemProps & { isLast?: boolean }) {
  return (
    <li data-slot="timeline-item" data-status={status} className="flex gap-3">
      {/* Dot + connector */}
      <div className="flex flex-col items-center">
        <span
          className={cn(
            'mt-1 size-2.5 shrink-0 rounded-full',
            status === 'completed' ? 'bg-orange-400' : 'bg-muted-foreground/30',
          )}
        />
        {!isLast && <span className="mt-1 w-px grow bg-border" />}
      </div>

      {/* Content */}
      <div className={cn('pb-5', isLast && 'pb-0')}>
        <p
          className={cn(
            'text-sm font-semibold leading-tight',
            status === 'pending' && 'text-muted-foreground',
          )}
        >
          {label}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{timestamp}</p>
      </div>
    </li>
  )
}

export { Timeline, TimelineItem }
export type { TimelineProps, TimelineItemProps, TimelineStatus }

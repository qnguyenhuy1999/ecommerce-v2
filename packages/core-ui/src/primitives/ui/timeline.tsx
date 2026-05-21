import * as React from 'react'

import { Typography } from '../../atoms/Typography'
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
        <Typography
          variant="caption"
          className="text-muted-foreground mb-4 font-semibold tracking-widest uppercase"
        >
          {title}
        </Typography>
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
            status === 'completed' ? 'bg-primary' : 'bg-muted-foreground/30',
          )}
        />
        {!isLast && <span className="bg-border mt-1 w-px grow" />}
      </div>

      {/* Content */}
      <div className={cn('pb-5', isLast && 'pb-0')}>
        <Typography
          variant="label"
          className={cn(
            'leading-tight font-semibold',
            status === 'pending' && 'text-muted-foreground',
          )}
        >
          {label}
        </Typography>
        <Typography variant="caption" className="text-muted-foreground mt-0.5">
          {timestamp}
        </Typography>
      </div>
    </li>
  )
}

export { Timeline, TimelineItem }
export type { TimelineProps, TimelineItemProps, TimelineStatus }

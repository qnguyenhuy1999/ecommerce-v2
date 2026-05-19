import { withDefined } from '@ecom/shared/utils'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { StatCardChart } from './StatCard.client'
import { accentMap } from './StatCard.fixtures'
import type { Accent, StatCardHeader, StatCardProps } from './StatCard.types'

function Header({ label, icon: Icon, accent = 'primary' }: StatCardHeader) {
  const colors = accentMap[accent]

  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-muted-foreground/90 text-sm font-medium tracking-[0.02em] uppercase">
        {label}
      </span>
      {Icon && (
        <span className={cn('flex h-8 w-8 items-center justify-center rounded-xl', colors.soft)}>
          <Icon className="h-4 w-4" />
        </span>
      )}
    </div>
  )
}

function Trend({ trend, description }: { trend: number; description?: string }) {
  const isNegative = trend < 0
  const Icon = isNegative ? ArrowDownRight : ArrowUpRight
  const color = isNegative ? 'text-destructive' : 'text-success'

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Icon className={cn('h-3.5 w-3.5', color)} strokeWidth={2.2} />
      <span className={cn('font-semibold tabular-nums', color)}>
        {trend > 0 ? '+' : ''}
        {trend}%
      </span>
      <span className="text-muted-foreground">{description || 'vs prev'}</span>
    </div>
  )
}

function Root({
  accent = 'primary',
  className,
  children,
}: {
  accent?: Accent
  className?: string
  children: ReactNode
}) {
  return (
    <div
      data-accent={accent}
      className={cn(
        'bg-card border-border/90 flex items-start justify-between gap-2 rounded-2xl border p-4 shadow-xs',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function StatCardBase({
  label,
  value,
  icon,
  trend,
  spark,
  accent = 'primary',
  className,
  description,
}: StatCardProps) {
  return (
    <Root accent={accent} {...withDefined({ className })}>
      <div className="flex h-full min-w-0 flex-col justify-between gap-3">
        <Header label={label} {...withDefined({ icon, accent })} />

        <div className="text-foreground text-xl leading-none font-semibold tracking-[-0.03em] tabular-nums">
          {value}
        </div>

        {typeof trend === 'number' ? (
          <Trend trend={trend} {...withDefined({ description })} />
        ) : description ? (
          <div className="xs">{description}</div>
        ) : null}
      </div>

      <StatCardChart spark={spark ?? []} accent={accent} />
    </Root>
  )
}

type StatCardComponent = typeof StatCardBase & {
  Root: typeof Root
  Header: typeof Header
  Chart: typeof StatCardChart
  Trend: typeof Trend
}

export const StatCard = Object.assign(StatCardBase, {
  Root,
  Header,
  Chart: StatCardChart,
  Trend,
}) satisfies StatCardComponent

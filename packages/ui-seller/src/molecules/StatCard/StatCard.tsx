import { cn } from '../../lib/utils'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { StatCardContext, useStatCard } from './StatCard.context'
import { accentMap } from './StatCard.fixtures'
import type { StatCardHeader, StatCardProps, StatChartProps } from './StatCard.types'

function Header({ label, icon: Icon }: StatCardHeader) {
  const { colors } = useStatCard()

  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
        {label}
      </span>
      {Icon && (
        <span className={cn('h-7 w-7 rounded-md flex items-center justify-center', colors.soft)}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  )
}

function Chart({ value, spark }: StatChartProps) {
  const { accent, colors } = useStatCard()

  return (
    <div className="flex items-end justify-between gap-2">
      <div className="font-display font-bold text-2xl tabular-nums leading-none">{value}</div>

      {spark && (
        <div className="h-8 w-20 -mr-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark}>
              <defs>
                <linearGradient id={`sg-${accent}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.stroke} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={colors.stroke} stopOpacity={0} />
                </linearGradient>
              </defs>

              <Area
                type="monotone"
                dataKey="y"
                stroke={colors.stroke}
                strokeWidth={1.5}
                fill={`url(#sg-${accent})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

function Trend({ trend }: { trend: number }) {
  const isNegative = trend < 0
  const Icon = isNegative ? TrendingDown : TrendingUp
  const color = isNegative ? 'text-destructive' : 'text-success'

  return (
    <div className="flex items-center gap-1 text-xs">
      <Icon className={cn('h-3.5 w-3.5', color)} />
      <span className={cn('font-semibold tabular-nums', color)}>
        {trend > 0 ? '+' : ''}
        {trend}%
      </span>
      <span className="text-muted-foreground">vs last week</span>
    </div>
  )
}

function Root({
  accent = 'primary',
  className,
  children,
}: {
  accent?: keyof typeof accentMap
  className?: string
  children: React.ReactNode
}) {
  const colors = accentMap[accent]

  return (
    <StatCardContext.Provider value={{ accent, colors }}>
      <div
        className={cn(
          'rounded-lg bg-surface border border-border p-3.5 flex flex-col gap-2',
          className,
        )}
      >
        {children}
      </div>
    </StatCardContext.Provider>
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
}: StatCardProps) {
  return (
    <Root accent={accent} className={className}>
      <Header label={label} icon={icon} />
      <Chart value={value} spark={spark} />
      {typeof trend === 'number' && <Trend trend={trend} />}
    </Root>
  )
}

type StatCardComponent = React.FC<StatCardProps> & {
  Root: typeof Root
  Header: typeof Header
  Chart: typeof Chart
  Trend: typeof Trend
}

export const StatCard = Object.assign(StatCardBase, {
  Root,
  Header,
  Chart,
  Trend,
}) as StatCardComponent

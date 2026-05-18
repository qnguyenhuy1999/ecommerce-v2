import { useId } from 'react'
import { cn } from '../../lib/utils'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { StatCardContext, useStatCard } from './StatCard.context'
import { accentMap } from './StatCard.fixtures'
import type { StatCardHeader, StatCardProps, StatChartProps } from './StatCard.types'

function Header({ label, icon: Icon }: StatCardHeader) {
  const { colors } = useStatCard()

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

function Chart({ value, spark }: StatChartProps) {
  const { accent, colors } = useStatCard()
  const gradientId = useId()

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-foreground text-xl leading-none font-semibold tracking-[-0.03em] tabular-nums">
        {value}
      </div>

      {spark && (
        <div className="-mr-1 h-11 w-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark}>
              <defs key={accent}>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.fill} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={colors.fill} stopOpacity={0.15} />
                </linearGradient>
              </defs>

              <Area
                type="linear"
                dataKey="y"
                stroke={colors.stroke}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
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
  accent?: keyof typeof accentMap
  className?: string
  children: React.ReactNode
}) {
  const colors = accentMap[accent]

  return (
    <StatCardContext.Provider value={{ accent, colors }}>
      <div
        className={cn(
          'bg-card border-border/90 flex min-h-32 flex-col gap-4 rounded-2xl border px-4 py-4 shadow-xs',
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
  description,
}: StatCardProps) {
  return (
    <Root accent={accent} {...(className !== undefined ? { className } : {})}>
      <Header
        {...(label !== undefined ? { label } : {})}
        {...(icon !== undefined ? { icon } : {})}
      />
      <Chart value={value} {...(spark !== undefined ? { spark } : {})} />
      {typeof trend === 'number' && (
        <Trend trend={trend} {...(description !== undefined ? { description } : {})} />
      )}
      {typeof trend !== 'number' && description ? <div className="xs">{description}</div> : null}
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

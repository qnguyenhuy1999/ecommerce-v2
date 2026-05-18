import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { SectionCard } from '../../atoms/SectionCard'
import type { DashboardProps } from './Dashboard.types'
import { dashboardChevronIcon, dashboardTodoStyles, formatDashboardNumber } from './Dashboard.utils'
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent'
import { Badge } from '@ecom/core-ui'
import { cn } from '../../lib/utils'

const ChevronIcon = dashboardChevronIcon

export function DashboardRevenueAndTodoSection({
  revenueSeries,
  todos,
}: {
  revenueSeries: NonNullable<DashboardProps['revenueSeries']>
  todos: NonNullable<DashboardProps['todos']>
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.95fr)_minmax(0,0.95fr)]">
      <SectionCard
        title="Revenue (30 days)"
        subtitle={<span className="text-success">+12.4% vs prev period</span>}
        action={<span className="text-muted-foreground text-xs tabular-nums">$ thousands</span>}
        padded={false}
      >
        <div className="h-62 px-2 py-4 sm:px-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueSeries} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dashboard-revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
              <XAxis
                axisLine={false}
                tickLine={false}
                dataKey="label"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                interval="preserveStartEnd"
                minTickGap={28}
              />
              <Tooltip
                cursor={{ stroke: 'var(--border)', strokeDasharray: '4 4' }}
                contentStyle={{
                  borderColor: 'var(--border)',
                  borderRadius: 16,
                  backgroundColor: 'var(--card)',
                  color: 'var(--foreground)',
                }}
                formatter={(value: ValueType | undefined) => {
                  const amount = typeof value === 'number' ? value : Number(value ?? 0)

                  return [`$${formatDashboardNumber(amount)}`, 'Revenue']
                }}
                labelStyle={{ color: 'var(--muted-foreground)' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={3}
                fill="url(#dashboard-revenue)"
                dot={false}
                activeDot={{ r: 4, fill: 'var(--primary)' }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="To-do" padded={false}>
        <div>
          {todos.map((item, index) => {
            const tone = dashboardTodoStyles[item.tone ?? 'default']
            const Icon = tone.icon

            return (
              <div
                key={item.label}
                className={cn(
                  'flex items-center gap-3 px-4 py-3.5',
                  index !== 0 && 'border-border border-t',
                )}
              >
                <span
                  className={cn(
                    'inline-flex size-8 items-center justify-center rounded-full',
                    tone.iconClassName,
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1 text-sm font-medium">{item.label}</div>
                <Badge className={tone.badgeClassName} variant="secondary">
                  {item.count}
                </Badge>
                <ChevronIcon className="text-muted-foreground size-4" />
              </div>
            )
          })}
        </div>
      </SectionCard>
    </section>
  )
}

'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatCard,
} from '@ecom/core-ui'
import { Download } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { SectionCard } from '../../atoms/SectionCard'
import { cn } from '../../lib/utils'
import { analyticsDefaultProps } from './Analytics.fixtures'
import type { AnalyticsProps } from './Analytics.types'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function TrafficLegend({
  trafficSources,
}: {
  trafficSources: NonNullable<AnalyticsProps['trafficSources']>
}) {
  return (
    <div className="space-y-2">
      {trafficSources.map((source) => (
        <div key={source.label} className="flex items-center justify-between gap-3 text-sm">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="inline-flex size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: source.color }}
            />
            <span className="text-muted-foreground truncate">{source.label}</span>
          </div>
          <span className="font-medium tabular-nums">{source.value}%</span>
        </div>
      ))}
    </div>
  )
}

function FunnelBar({ value, color }: { value: number; color?: string }) {
  return (
    <div className="bg-muted h-2.5 overflow-hidden rounded-full">
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.max(0, Math.min(value, 100))}%`,
          background: color
            ? `linear-gradient(90deg, ${color} 0%, ${color} 100%)`
            : 'linear-gradient(90deg, #ea580c 0%, #fb923c 100%)',
        }}
      />
    </div>
  )
}

function RevenueTrendSection({
  revenueSeries,
}: {
  revenueSeries: NonNullable<AnalyticsProps['revenueSeries']>
}) {
  return (
    <SectionCard title="Revenue trend" padded={false}>
      <div className="h-72 px-2 py-4 sm:px-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueSeries} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="analytics-revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.34} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
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
            <YAxis hide />
            <Tooltip
              cursor={{ stroke: 'var(--border)', strokeDasharray: '4 4' }}
              contentStyle={{
                borderColor: 'var(--border)',
                borderRadius: 16,
                backgroundColor: 'var(--card)',
                color: 'var(--foreground)',
              }}
              formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Revenue']}
              labelStyle={{ color: 'var(--muted-foreground)' }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#ea580c"
              strokeWidth={3}
              fill="url(#analytics-revenue)"
              dot={false}
              activeDot={{ r: 4, fill: '#ea580c' }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  )
}

function TrafficSourcesSection({
  trafficSources,
}: {
  trafficSources: NonNullable<AnalyticsProps['trafficSources']>
}) {
  const chartData = trafficSources.map((source) => ({ ...source, fill: source.color }))

  return (
    <SectionCard title="Traffic sources">
      <div className="grid gap-4 md:grid-cols-[9rem_minmax(0,1fr)] md:items-center">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={42}
                outerRadius={74}
                paddingAngle={2}
                strokeWidth={0}
                isAnimationActive={false}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <TrafficLegend trafficSources={trafficSources} />
      </div>
    </SectionCard>
  )
}

function OrdersByDaySection({
  ordersByDaySeries,
}: {
  ordersByDaySeries: NonNullable<AnalyticsProps['ordersByDaySeries']>
}) {
  return (
    <SectionCard title="Orders by day" padded={false}>
      <div className="h-64 px-2 py-4 sm:px-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ordersByDaySeries} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.35} />
            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey="label"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: 'rgba(249, 115, 22, 0.08)' }}
              contentStyle={{
                borderColor: 'var(--border)',
                borderRadius: 16,
                backgroundColor: 'var(--card)',
                color: 'var(--foreground)',
              }}
              formatter={(value) => [`${Number(value ?? 0)} orders`, 'Orders']}
              labelStyle={{ color: 'var(--muted-foreground)' }}
            />
            <Bar
              dataKey="orders"
              fill="#fb923c"
              radius={[10, 10, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  )
}

export function AnalyticsPageActions({
  dateRange = analyticsDefaultProps.dateRange,
  dateRangeOptions = analyticsDefaultProps.dateRangeOptions,
  onDateRangeChange,
  exportHref = analyticsDefaultProps.exportHref,
  onExport,
}: Pick<
  AnalyticsProps,
  'dateRange' | 'dateRangeOptions' | 'onDateRangeChange' | 'exportHref' | 'onExport'
>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={dateRange} onValueChange={(value) => onDateRangeChange?.(value)}>
        <SelectTrigger className="bg-background w-39">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          {dateRangeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {onExport ? (
        <Button variant="outline" onClick={onExport}>
          <Download />
          Export
        </Button>
      ) : (
        <Button asChild variant="outline">
          <a href={exportHref}>
            <Download />
            Export
          </a>
        </Button>
      )}
    </div>
  )
}

export function AnalyticsClient({
  metrics = analyticsDefaultProps.metrics,
  revenueSeries = analyticsDefaultProps.revenueSeries,
  trafficSources = analyticsDefaultProps.trafficSources,
  ordersByDaySeries = analyticsDefaultProps.ordersByDaySeries,
  conversionFunnel = analyticsDefaultProps.conversionFunnel,
  topProducts = analyticsDefaultProps.topProducts,
}: Pick<
  AnalyticsProps,
  | 'metrics'
  | 'revenueSeries'
  | 'trafficSources'
  | 'ordersByDaySeries'
  | 'conversionFunnel'
  | 'topProducts'
>) {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            {...(typeof metric.trend === 'number' ? { trend: metric.trend } : {})}
            {...(metric.spark ? { spark: metric.spark } : {})}
            {...(metric.accent ? { accent: metric.accent } : {})}
            {...(metric.description ? { description: metric.description } : {})}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.95fr)_minmax(0,0.95fr)]">
        <RevenueTrendSection revenueSeries={revenueSeries} />
        <TrafficSourcesSection trafficSources={trafficSources} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <OrdersByDaySection ordersByDaySeries={ordersByDaySeries} />

        <SectionCard title="Conversion funnel">
          <div className="space-y-4">
            {conversionFunnel.map((stage) => (
              <div key={stage.label} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{stage.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {stage.conversionLabel}
                  </span>
                </div>
                <FunnelBar value={stage.value} {...(stage.color ? { color: stage.color } : {})} />
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <SectionCard title="Top products" padded={false}>
        <div className="overflow-x-auto">
          <div className="min-w-176">
            <div className="text-muted-foreground grid grid-cols-[4rem_minmax(0,1.6fr)_7rem_8rem_6rem] gap-3 border-b px-4 py-3 text-xs font-semibold tracking-[0.02em] uppercase">
              <span>#</span>
              <span>Product</span>
              <span className="text-right">Units</span>
              <span className="text-right">Revenue</span>
              <span className="text-right">Conv.</span>
            </div>

            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className={cn(
                  'grid grid-cols-[4rem_minmax(0,1.6fr)_7rem_8rem_6rem] gap-3 px-4 py-3.5',
                  index !== 0 && 'border-border border-t',
                )}
              >
                <div className="text-muted-foreground text-sm tabular-nums">{product.rank}</div>
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="rounded-xl" size="lg">
                    <AvatarImage alt={product.name} className="rounded-xl" src={product.imageUrl} />
                    <AvatarFallback className="rounded-xl">P{product.rank}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 text-sm font-medium">
                    <p className="truncate">{product.name}</p>
                  </div>
                </div>
                <div className="text-right text-sm tabular-nums">{product.units}</div>
                <div className="text-right text-sm font-medium tabular-nums">{product.revenue}</div>
                <div className="text-right text-sm tabular-nums">{product.conversion}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

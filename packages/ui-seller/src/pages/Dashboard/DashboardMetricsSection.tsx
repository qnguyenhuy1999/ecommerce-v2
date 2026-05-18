import { StatCard } from '@ecom/core-ui'
import type { DashboardProps } from './Dashboard.types'

export function DashboardMetricsSection({
  metrics,
}: {
  metrics: NonNullable<DashboardProps['metrics']>
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <StatCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          trend={metric.trend}
          spark={metric.spark}
          accent={metric.accent}
        />
      ))}
    </section>
  )
}

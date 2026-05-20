import { ConsolePageLayout } from '@ecom/core-ui'
import { AnalyticsClient, AnalyticsPageActions } from './Analytics.client'
import { analyticsDefaultProps } from './Analytics.fixtures'
import type { AnalyticsProps } from './Analytics.types'

export function Analytics({
  title = analyticsDefaultProps.title,
  description = analyticsDefaultProps.description,
  breadcrumb,
  dateRange = analyticsDefaultProps.dateRange,
  dateRangeOptions = analyticsDefaultProps.dateRangeOptions,
  onDateRangeChange,
  exportHref = analyticsDefaultProps.exportHref,
  onExport,
  metrics = analyticsDefaultProps.metrics,
  revenueSeries = analyticsDefaultProps.revenueSeries,
  trafficSources = analyticsDefaultProps.trafficSources,
  ordersByDaySeries = analyticsDefaultProps.ordersByDaySeries,
  conversionFunnel = analyticsDefaultProps.conversionFunnel,
  topProducts = analyticsDefaultProps.topProducts,
}: AnalyticsProps) {
  const pageLayoutProps = {
    ...(breadcrumb ? { breadcrumb } : {}),
  }

  const pageActionProps = {
    ...(onDateRangeChange ? { onDateRangeChange } : {}),
    ...(onExport ? { onExport } : {}),
  }

  return (
    <ConsolePageLayout
      title={title}
      description={description}
      {...pageLayoutProps}
      actions={
        <AnalyticsPageActions
          dateRange={dateRange}
          dateRangeOptions={dateRangeOptions}
          exportHref={exportHref}
          {...pageActionProps}
        />
      }
      mainClassName="space-y-5"
    >
      <AnalyticsClient
        metrics={metrics}
        revenueSeries={revenueSeries}
        trafficSources={trafficSources}
        ordersByDaySeries={ordersByDaySeries}
        conversionFunnel={conversionFunnel}
        topProducts={topProducts}
      />
    </ConsolePageLayout>
  )
}

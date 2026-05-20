import type { ConsoleBreadcrumbItem, StatCardProps } from '@ecom/core-ui'

export type AnalyticsMetric = Pick<
  StatCardProps,
  'label' | 'value' | 'trend' | 'spark' | 'accent' | 'description'
>

export interface AnalyticsDateRangeOption {
  value: string
  label: string
}

export interface AnalyticsRevenuePoint {
  label: string
  revenue: number
}

export interface AnalyticsTrafficSource {
  label: string
  value: number
  color: string
}

export interface AnalyticsOrdersByDayPoint {
  label: string
  orders: number
}

export interface AnalyticsFunnelStage {
  label: string
  value: number
  conversionLabel: string
  color?: string
}

export interface AnalyticsTopProduct {
  id: string
  rank: number
  name: string
  imageUrl: string
  units: number
  revenue: string
  conversion: string
}

export interface AnalyticsProps {
  title?: string
  description?: string
  breadcrumb?: ConsoleBreadcrumbItem[]
  dateRange?: string
  dateRangeOptions?: AnalyticsDateRangeOption[]
  onDateRangeChange?: (value: string) => void
  exportHref?: string
  onExport?: () => void
  metrics?: AnalyticsMetric[]
  revenueSeries?: AnalyticsRevenuePoint[]
  trafficSources?: AnalyticsTrafficSource[]
  ordersByDaySeries?: AnalyticsOrdersByDayPoint[]
  conversionFunnel?: AnalyticsFunnelStage[]
  topProducts?: AnalyticsTopProduct[]
}

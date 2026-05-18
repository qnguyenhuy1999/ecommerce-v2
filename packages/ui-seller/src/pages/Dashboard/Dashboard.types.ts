import type { StatCardProps } from '@ecom/core-ui'
import type { ProductStatusPillVariantProps } from '../../atoms/ProductStatusPill/ProductStatusPill.fixtures'

type Metric = Pick<StatCardProps, 'label' | 'value' | 'trend' | 'spark' | 'accent'>

type RevenuePoint = {
  label: string
  revenue: number
}

type TodoTone = 'default' | 'warning' | 'destructive' | 'info'

type TodoItem = {
  label: string
  count: number
  tone?: TodoTone
}

type PendingOrder = {
  id: string
  customer: string
  amount: string
  status: ProductStatusPillVariantProps['variant']
  imageUrl: string
}

type LowStockItem = {
  name: string
  sku: string
  remaining: number
  imageUrl: string
}

type PromotionItem = {
  name: string
  redeemed: number
  total: number
  status: string
}

type TopProduct = {
  rank: number
  name: string
  sold: number
  revenue: string
  imageUrl: string
}

type ActivityItem = {
  title: string
  detail: string
  time: string
}

export interface DashboardProps {
  snapshotLabel?: string
  ordersHref?: string
  metrics?: Metric[]
  revenueSeries?: RevenuePoint[]
  todos?: TodoItem[]
  pendingOrders?: PendingOrder[]
  lowStockItems?: LowStockItem[]
  promotions?: PromotionItem[]
  topProducts?: TopProduct[]
  recentActivity?: ActivityItem[]
}

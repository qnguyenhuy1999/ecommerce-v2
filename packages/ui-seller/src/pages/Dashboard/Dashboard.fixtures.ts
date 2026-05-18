import type { DashboardProps } from './Dashboard.types'

export const dashboardMetrics: DashboardProps['metrics'] = [
  {
    label: 'Revenue (7D)',
    value: '$18,420',
    trend: 12.4,
    accent: 'success',
    spark: [
      { x: 1, y: 16 },
      { x: 2, y: 24 },
      { x: 3, y: 24 },
      { x: 4, y: 18 },
      { x: 5, y: 12 },
      { x: 6, y: 14 },
      { x: 7, y: 22 },
    ],
  },
  {
    label: 'Orders (7D)',
    value: '412',
    trend: 8.1,
    accent: 'success',
    spark: [
      { x: 1, y: 14 },
      { x: 2, y: 22 },
      { x: 3, y: 21 },
      { x: 4, y: 15 },
      { x: 5, y: 10 },
      { x: 6, y: 13 },
      { x: 7, y: 20 },
    ],
  },
  {
    label: 'Conversion',
    value: '3.8%',
    trend: -0.4,
    accent: 'destructive',
    spark: [
      { x: 1, y: 10 },
      { x: 2, y: 18 },
      { x: 3, y: 18 },
      { x: 4, y: 10 },
      { x: 5, y: 10 },
      { x: 6, y: 10 },
      { x: 7, y: 10 },
    ],
  },
  {
    label: 'AOV',
    value: '$44.70',
    trend: 2.2,
    accent: 'success',
    spark: [
      { x: 1, y: 13 },
      { x: 2, y: 20 },
      { x: 3, y: 20 },
      { x: 4, y: 14 },
      { x: 5, y: 10 },
      { x: 6, y: 13 },
      { x: 7, y: 18 },
    ],
  },
]

export const dashboardRevenueSeries: DashboardProps['revenueSeries'] = [
  { label: 'May 1', revenue: 12000 },
  { label: 'May 4', revenue: 24800 },
  { label: 'May 7', revenue: 26000 },
  { label: 'May 10', revenue: 21000 },
  { label: 'May 13', revenue: 14000 },
  { label: 'May 16', revenue: 12200 },
  { label: 'May 19', revenue: 14500 },
  { label: 'May 22', revenue: 23200 },
  { label: 'May 25', revenue: 37200 },
  { label: 'May 28', revenue: 45800 },
  { label: 'May 30', revenue: 49200 },
  { label: 'Jun 2', revenue: 48600 },
  { label: 'Jun 5', revenue: 44200 },
  { label: 'Jun 8', revenue: 37200 },
]

export const dashboardTodos: DashboardProps['todos'] = [
  { label: 'Ship today', count: 14, tone: 'warning' },
  { label: 'Low stock', count: 6, tone: 'destructive' },
  { label: 'Awaiting reply', count: 9, tone: 'info' },
  { label: 'Return requests', count: 2, tone: 'default' },
]

export const dashboardPendingOrders: DashboardProps['pendingOrders'] = [
  {
    id: 'ORD-100341',
    customer: 'Priya R.',
    amount: '$296',
    status: 'shipping',
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'ORD-100348',
    customer: 'Marco D.',
    amount: '$243',
    status: 'shipping',
    imageUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'ORD-100355',
    customer: 'Chloe N.',
    amount: '$260',
    status: 'review',
    imageUrl:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'ORD-100362',
    customer: 'Yuki I.',
    amount: '$486',
    status: 'cancelled',
    imageUrl:
      'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=120&q=80',
  },
]

export const dashboardLowStockItems: DashboardProps['lowStockItems'] = [
  {
    name: 'Wireless ANC Headphones - Studio Edition',
    sku: 'SKU LUM-1000',
    remaining: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=120&q=80',
  },
  {
    name: 'Linen Lounge Set, Oversized Fit',
    sku: 'SKU LUM-1001',
    remaining: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=120&q=80',
  },
  {
    name: 'Mechanical Keyboard, Hot-Swap 75%',
    sku: 'SKU LUM-1002',
    remaining: 19,
    imageUrl:
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=120&q=80',
  },
  {
    name: 'Ceramic Pour-Over Coffee Set',
    sku: 'SKU LUM-1003',
    remaining: 26,
    imageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=120&q=80',
  },
]

export const dashboardPromotions: DashboardProps['promotions'] = [
  {
    name: 'May Audio Flash',
    redeemed: 312,
    total: 500,
    status: 'Live',
  },
  {
    name: 'Bundle: Desk Setup',
    redeemed: 96,
    total: 1000,
    status: 'Live',
  },
]

export const dashboardTopProducts: DashboardProps['topProducts'] = [
  {
    rank: 1,
    name: 'Wireless ANC Headphones - Studio Edition',
    sold: 50,
    revenue: '$9k',
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=120&q=80',
  },
  {
    rank: 2,
    name: 'Linen Lounge Set, Oversized Fit',
    sold: 141,
    revenue: '$22k',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=120&q=80',
  },
  {
    rank: 3,
    name: 'Mechanical Keyboard, Hot-Swap 75%',
    sold: 232,
    revenue: '$35k',
    imageUrl:
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=120&q=80',
  },
  {
    rank: 4,
    name: 'Ceramic Pour-Over Coffee Set',
    sold: 323,
    revenue: '$48k',
    imageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=120&q=80',
  },
  {
    rank: 5,
    name: 'Minimalist Leather Card Holder',
    sold: 414,
    revenue: '$61k',
    imageUrl:
      'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=120&q=80',
  },
]

export const dashboardRecentActivity: DashboardProps['recentActivity'] = [
  {
    title: 'ORD-100341 placed',
    detail: 'Priya R. - $89.90',
    time: '15:00',
  },
  {
    title: 'New 5-star review',
    detail: 'Wireless ANC Headphones',
    time: '14:00',
  },
  {
    title: 'Low stock alert',
    detail: 'Mechanical Keyboard 75% - 4 left',
    time: '12:00',
  },
  {
    title: 'ORD-100340 shipped',
    detail: 'Tracking attached',
    time: '08:00',
  },
  {
    title: 'Payout PO-1043 paid',
    detail: '$17,628.00 to bank - 8842',
    time: '16:00',
  },
  {
    title: 'KYC verified',
    detail: 'Bank account confirmed',
    time: '16:00',
  },
]

export const dashboardDefaultProps = {
  snapshotLabel: 'Snapshot for May 11, 2026 - Lumen Audio Official',
  ordersHref: '#orders',
  metrics: dashboardMetrics,
  revenueSeries: dashboardRevenueSeries,
  todos: dashboardTodos,
  pendingOrders: dashboardPendingOrders,
  lowStockItems: dashboardLowStockItems,
  promotions: dashboardPromotions,
  topProducts: dashboardTopProducts,
  recentActivity: dashboardRecentActivity,
} satisfies {
  snapshotLabel: string
  ordersHref: string
  metrics: NonNullable<DashboardProps['metrics']>
  revenueSeries: NonNullable<DashboardProps['revenueSeries']>
  todos: NonNullable<DashboardProps['todos']>
  pendingOrders: NonNullable<DashboardProps['pendingOrders']>
  lowStockItems: NonNullable<DashboardProps['lowStockItems']>
  promotions: NonNullable<DashboardProps['promotions']>
  topProducts: NonNullable<DashboardProps['topProducts']>
  recentActivity: NonNullable<DashboardProps['recentActivity']>
}

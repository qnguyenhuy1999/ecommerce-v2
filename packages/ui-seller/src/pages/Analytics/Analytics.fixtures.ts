import type { AnalyticsProps } from './Analytics.types'

export const analyticsDateRangeOptions: NonNullable<AnalyticsProps['dateRangeOptions']> = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
]

export const analyticsMetrics: NonNullable<AnalyticsProps['metrics']> = [
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

export const analyticsRevenueSeries: NonNullable<AnalyticsProps['revenueSeries']> = [
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

export const analyticsTrafficSources: NonNullable<AnalyticsProps['trafficSources']> = [
  { label: 'Direct', value: 42, color: '#f97316' },
  { label: 'Search', value: 28, color: '#16a34a' },
  { label: 'Social', value: 18, color: '#0284c7' },
  { label: 'Referral', value: 12, color: '#eab308' },
]

export const analyticsOrdersByDaySeries: NonNullable<AnalyticsProps['ordersByDaySeries']> = [
  { label: 'Mon', orders: 42 },
  { label: 'Tue', orders: 56 },
  { label: 'Wed', orders: 48 },
  { label: 'Thu', orders: 64 },
  { label: 'Fri', orders: 74 },
  { label: 'Sat', orders: 61 },
  { label: 'Sun', orders: 67 },
]

export const analyticsConversionFunnel: NonNullable<AnalyticsProps['conversionFunnel']> = [
  { label: 'Visit', value: 100, conversionLabel: '12.5k · 100.0%', color: '#ea580c' },
  { label: 'PDP', value: 50, conversionLabel: '6.2k · 50.0%', color: '#f97316' },
  { label: 'Cart', value: 14.7, conversionLabel: '1.8k · 14.7%', color: '#fb923c' },
  { label: 'Checkout', value: 7.4, conversionLabel: '920 · 7.4%', color: '#fdba74' },
  { label: 'Paid', value: 3.3, conversionLabel: '412 · 3.3%', color: '#fed7aa' },
]

export const analyticsTopProducts: NonNullable<AnalyticsProps['topProducts']> = [
  {
    id: 'analytics-product-1',
    rank: 1,
    name: 'Wireless ANC Headphones — Studio Edition',
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=120&q=80',
    units: 50,
    revenue: '$4.50',
    conversion: '2.0%',
  },
  {
    id: 'analytics-product-2',
    rank: 2,
    name: 'Linen Lounge Set, Oversized Fit',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=120&q=80',
    units: 141,
    revenue: '$31.02',
    conversion: '2.4%',
  },
  {
    id: 'analytics-product-3',
    rank: 3,
    name: 'Mechanical Keyboard, Hot-Swap 75%',
    imageUrl:
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=120&q=80',
    units: 232,
    revenue: '$81.20',
    conversion: '2.8%',
  },
  {
    id: 'analytics-product-4',
    rank: 4,
    name: 'Ceramic Pour-Over Coffee Set',
    imageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=120&q=80',
    units: 323,
    revenue: '$155.04',
    conversion: '3.2%',
  },
  {
    id: 'analytics-product-5',
    rank: 5,
    name: 'Minimalist Leather Card Holder',
    imageUrl:
      'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=120&q=80',
    units: 414,
    revenue: '$252.54',
    conversion: '3.6%',
  },
  {
    id: 'analytics-product-6',
    rank: 6,
    name: 'Smart Desk Lamp with USB-C',
    imageUrl:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=120&q=80',
    units: 505,
    revenue: '$373.70',
    conversion: '4.0%',
  },
]

export const analyticsDefaultProps = {
  title: 'Analytics',
  description: 'Performance and growth signals',
  dateRange: '7d',
  dateRangeOptions: analyticsDateRangeOptions,
  exportHref: '#',
  metrics: analyticsMetrics,
  revenueSeries: analyticsRevenueSeries,
  trafficSources: analyticsTrafficSources,
  ordersByDaySeries: analyticsOrdersByDaySeries,
  conversionFunnel: analyticsConversionFunnel,
  topProducts: analyticsTopProducts,
} satisfies Required<
  Pick<
    AnalyticsProps,
    | 'title'
    | 'description'
    | 'dateRange'
    | 'dateRangeOptions'
    | 'exportHref'
    | 'metrics'
    | 'revenueSeries'
    | 'trafficSources'
    | 'ordersByDaySeries'
    | 'conversionFunnel'
    | 'topProducts'
  >
>

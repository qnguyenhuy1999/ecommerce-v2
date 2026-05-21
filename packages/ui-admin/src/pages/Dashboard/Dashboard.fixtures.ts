import type { DashboardProps } from './Dashboard.types'

export const dashboardMetrics: NonNullable<DashboardProps['metrics']> = [
  {
    label: 'Total users',
    value: '184.2k',
    trend: 4.8,
    accent: 'success',
    spark: [
      { x: 1, y: 30 },
      { x: 2, y: 44 },
      { x: 3, y: 40 },
      { x: 4, y: 24 },
      { x: 5, y: 22 },
      { x: 6, y: 38 },
      { x: 7, y: 48 },
      { x: 8, y: 42 },
    ],
  },
  {
    label: 'Total sellers',
    value: '1.3k',
    trend: 3.2,
    accent: 'success',
    spark: [
      { x: 1, y: 28 },
      { x: 2, y: 42 },
      { x: 3, y: 36 },
      { x: 4, y: 22 },
      { x: 5, y: 20 },
      { x: 6, y: 40 },
      { x: 7, y: 50 },
      { x: 8, y: 44 },
    ],
  },
  {
    label: 'Orders (30d)',
    value: '28.4k',
    trend: 9.8,
    accent: 'success',
    spark: [
      { x: 1, y: 34 },
      { x: 2, y: 46 },
      { x: 3, y: 39 },
      { x: 4, y: 23 },
      { x: 5, y: 25 },
      { x: 6, y: 43 },
      { x: 7, y: 52 },
      { x: 8, y: 46 },
    ],
  },
  {
    label: 'GMV (30d)',
    value: '$1,842,000',
    trend: 14.2,
    accent: 'success',
    spark: [
      { x: 1, y: 32 },
      { x: 2, y: 45 },
      { x: 3, y: 41 },
      { x: 4, y: 22 },
      { x: 5, y: 24 },
      { x: 6, y: 44 },
      { x: 7, y: 54 },
      { x: 8, y: 48 },
    ],
  },
]

export const dashboardRevenueSeries: NonNullable<DashboardProps['revenueSeries']> = [
  { label: 'Apr 28', revenue: 12 },
  { label: 'Apr 30', revenue: 20 },
  { label: 'May 2', revenue: 24 },
  { label: 'May 4', revenue: 23 },
  { label: 'May 6', revenue: 18 },
  { label: 'May 8', revenue: 11 },
  { label: 'May 10', revenue: 7 },
  { label: 'May 12', revenue: 6 },
  { label: 'May 14', revenue: 10 },
  { label: 'May 16', revenue: 18 },
  { label: 'May 18', revenue: 25 },
  { label: 'May 20', revenue: 29 },
  { label: 'May 22', revenue: 28 },
  { label: 'May 24', revenue: 23 },
]

export const dashboardPendingApprovals: NonNullable<DashboardProps['pendingApprovals']> = [
  { id: 'kyc', label: 'Seller KYC', countLabel: '2 to review' },
  { id: 'product-moderation', label: 'Product moderation', countLabel: '6 to review' },
  { id: 'refund-requests', label: 'Refund requests', countLabel: '6 to review' },
]

export const dashboardSystemHealth: NonNullable<DashboardProps['systemHealth']> = [
  {
    id: 'storefront-api',
    label: 'Storefront API',
    status: 'Operational',
    uptimeLabel: '99.99%',
    latencyLabel: '84ms',
  },
  {
    id: 'checkout',
    label: 'Checkout',
    status: 'Operational',
    uptimeLabel: '99.97%',
    latencyLabel: '142ms',
  },
  {
    id: 'payments',
    label: 'Payments',
    status: 'Degraded',
    uptimeLabel: '99.21%',
    latencyLabel: '612ms',
  },
  {
    id: 'search-index',
    label: 'Search index',
    status: 'Operational',
    uptimeLabel: '99.95%',
    latencyLabel: '96ms',
  },
  {
    id: 'image-cdn',
    label: 'Image CDN',
    status: 'Operational',
    uptimeLabel: '99.99%',
    latencyLabel: '38ms',
  },
]

export const dashboardModerationQueue: NonNullable<DashboardProps['moderationQueue']> = [
  {
    id: 'seller-1',
    sellerName: 'Lumen Audio',
    stateLabel: 'Awaiting review',
    tagLabel: 'Pending',
    dateLabel: 'May 11, 2026',
  },
  {
    id: 'seller-2',
    sellerName: 'Northbloom Living',
    stateLabel: 'Awaiting review',
    tagLabel: 'Pending',
    dateLabel: 'May 11, 2026',
  },
  {
    id: 'seller-3',
    sellerName: 'Kairo Tech',
    stateLabel: 'Awaiting review',
    tagLabel: 'Pending',
    dateLabel: 'May 10, 2026',
  },
  {
    id: 'seller-4',
    sellerName: 'Atelier Noor',
    stateLabel: 'Awaiting review',
    tagLabel: 'Pending',
    dateLabel: 'May 10, 2026',
  },
  {
    id: 'seller-5',
    sellerName: 'Verdant Co.',
    stateLabel: 'Awaiting review',
    tagLabel: 'Pending',
    dateLabel: 'May 10, 2026',
  },
  {
    id: 'seller-6',
    sellerName: 'Lumen Audio',
    stateLabel: 'Awaiting review',
    tagLabel: 'Pending',
    dateLabel: 'May 10, 2026',
  },
]

export const dashboardDisputeQueue: NonNullable<DashboardProps['disputeQueue']> = [
  {
    id: 'dsp-5200',
    ticket: 'DSP-5200',
    counterparties: 'Alex Tan ↔ Lumen Audio',
    stateLabel: 'Open',
    amountLabel: '$9',
    tone: 'info',
  },
  {
    id: 'dsp-5201',
    ticket: 'DSP-5201',
    counterparties: 'Priya R. ↔ Northbloom Living',
    stateLabel: 'Under review',
    amountLabel: '$296',
    tone: 'warning',
  },
  {
    id: 'dsp-5202',
    ticket: 'DSP-5202',
    counterparties: 'Marco D. ↔ Kairo Tech',
    stateLabel: 'Open',
    amountLabel: '$261',
    tone: 'muted',
  },
  {
    id: 'dsp-5203',
    ticket: 'DSP-5203',
    counterparties: 'Chloe N. ↔ Atelier Noor',
    stateLabel: 'Escalated',
    amountLabel: '$356',
    tone: 'destructive',
  },
  {
    id: 'dsp-5204',
    ticket: 'DSP-5204',
    counterparties: 'Yuki I. ↔ Verdant Co.',
    stateLabel: 'Refunded buyer',
    amountLabel: '$330',
    tone: 'success',
  },
  {
    id: 'dsp-5205',
    ticket: 'DSP-5205',
    counterparties: 'Sam W. ↔ Lumen Audio',
    stateLabel: 'Closed seller',
    amountLabel: '$972',
    tone: 'success',
  },
]

export const dashboardCampaigns: NonNullable<DashboardProps['campaigns']> = [
  {
    id: 'campaign-1',
    name: 'May Mega Sale',
    detail: 'Flash · Platform',
    statusLabel: 'Live',
    tone: 'success',
  },
  {
    id: 'campaign-2',
    name: 'Beauty Spotlight',
    detail: 'Banner · Beauty',
    statusLabel: 'Live',
    tone: 'success',
  },
  {
    id: 'campaign-3',
    name: 'Free Ship Weekend',
    detail: 'Coupon · Platform',
    statusLabel: 'Scheduled',
    tone: 'info',
  },
]

export const dashboardAuditEvents: NonNullable<DashboardProps['auditEvents']> = [
  {
    id: 'audit-1',
    actor: 'Ops Admin',
    action: 'approve seller',
    subject: 'Wei Lim',
    detail: 'Policy violation — counterfeit risk.',
    dateLabel: 'May 11, 2026',
  },
  {
    id: 'audit-2',
    actor: 'Sarah K.',
    action: 'reject product',
    subject: 'ORD-100340',
    dateLabel: 'May 11, 2026',
  },
  {
    id: 'audit-3',
    actor: 'Daniel L.',
    action: 'refund order',
    subject: 'ORD-100339',
    dateLabel: 'May 11, 2026',
  },
  {
    id: 'audit-4',
    actor: 'Mei L.',
    action: 'suspend user',
    subject: 'Marco Diaz',
    dateLabel: 'May 11, 2026',
  },
  {
    id: 'audit-5',
    actor: 'Iris Cho',
    action: 'update commission',
    subject: 'cr-fash',
    detail: 'Policy violation — counterfeit risk.',
    dateLabel: 'May 11, 2026',
  },
  {
    id: 'audit-6',
    actor: 'Ops Admin',
    action: 'resolve dispute',
    subject: 'DSP-5203',
    dateLabel: 'May 11, 2026',
  },
  {
    id: 'audit-7',
    actor: 'Sarah K.',
    action: 'create campaign',
    subject: 'Beauty Spotlight',
    dateLabel: 'May 10, 2026',
  },
  {
    id: 'audit-8',
    actor: 'Daniel L.',
    action: 'update role',
    subject: 'r-ops',
    dateLabel: 'May 10, 2026',
  },
]

export const dashboardDefaultProps = {
  title: 'Platform overview',
  description: 'Last 14 days · production environment',
  exportReportHref: '#export-report',
  openQueueHref: '#open-queue',
  metrics: dashboardMetrics,
  revenueSeries: dashboardRevenueSeries,
  revenueValueLabel: '$1,842,000',
  revenueTrendLabel: '+14.2% vs prev',
  pendingApprovals: dashboardPendingApprovals,
  systemHealth: dashboardSystemHealth,
  moderationQueue: dashboardModerationQueue,
  disputeQueue: dashboardDisputeQueue,
  campaigns: dashboardCampaigns,
  auditEvents: dashboardAuditEvents,
} satisfies Required<
  Pick<
    DashboardProps,
    | 'title'
    | 'description'
    | 'exportReportHref'
    | 'openQueueHref'
    | 'metrics'
    | 'revenueSeries'
    | 'revenueValueLabel'
    | 'revenueTrendLabel'
    | 'pendingApprovals'
    | 'systemHealth'
    | 'moderationQueue'
    | 'disputeQueue'
    | 'campaigns'
    | 'auditEvents'
  >
>

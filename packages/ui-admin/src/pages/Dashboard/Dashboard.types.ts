import type { StatCardProps } from '@ecom/core-ui'

type DashboardMetric = Pick<StatCardProps, 'label' | 'value' | 'trend' | 'spark' | 'accent'>

type RevenuePoint = {
  label: string
  revenue: number
}

type PendingApprovalItem = {
  id: string
  label: string
  countLabel: string
}

type SystemHealthItem = {
  id: string
  label: string
  status: 'Operational' | 'Degraded'
  uptimeLabel: string
  latencyLabel: string
}

type ModerationQueueItem = {
  id: string
  sellerName: string
  stateLabel: string
  tagLabel: string
  dateLabel: string
}

type DisputeQueueItem = {
  id: string
  ticket: string
  counterparties: string
  stateLabel: string
  amountLabel: string
  tone: 'info' | 'warning' | 'destructive' | 'success' | 'muted'
}

type CampaignItem = {
  id: string
  name: string
  detail: string
  statusLabel: string
  tone: 'info' | 'success'
}

type AuditEventItem = {
  id: string
  actor: string
  action: string
  subject: string
  detail?: string
  dateLabel: string
}

export interface DashboardProps {
  title?: string
  description?: string
  exportReportHref?: string
  openQueueHref?: string
  metrics?: DashboardMetric[]
  revenueSeries?: RevenuePoint[]
  revenueValueLabel?: string
  revenueTrendLabel?: string
  pendingApprovals?: PendingApprovalItem[]
  systemHealth?: SystemHealthItem[]
  moderationQueue?: ModerationQueueItem[]
  disputeQueue?: DisputeQueueItem[]
  campaigns?: CampaignItem[]
  auditEvents?: AuditEventItem[]
}

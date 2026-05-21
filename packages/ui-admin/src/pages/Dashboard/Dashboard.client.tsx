'use client'

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard,
  Typography,
} from '@ecom/core-ui'
import { Activity, ArrowRight, Circle, Megaphone, ShieldCheck } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DashboardProps } from './Dashboard.types'

interface DashboardClientProps {
  metrics: NonNullable<DashboardProps['metrics']>
  revenueSeries: NonNullable<DashboardProps['revenueSeries']>
  revenueValueLabel: string
  revenueTrendLabel: string
  pendingApprovals: NonNullable<DashboardProps['pendingApprovals']>
  systemHealth: NonNullable<DashboardProps['systemHealth']>
  moderationQueue: NonNullable<DashboardProps['moderationQueue']>
  disputeQueue: NonNullable<DashboardProps['disputeQueue']>
  campaigns: NonNullable<DashboardProps['campaigns']>
  auditEvents: NonNullable<DashboardProps['auditEvents']>
}

type DisputeTone = NonNullable<DashboardProps['disputeQueue']>[number]['tone']
type CampaignTone = NonNullable<DashboardProps['campaigns']>[number]['tone']

const dashboardCardClassName = 'rounded-3xl border-border/80 shadow-sm'
const dashboardActionClassName = 'text-primary'
const warningBadgeClassName = 'bg-warning/12 text-warning rounded-full'

function getDisputeToneClassNames(tone: DisputeTone) {
  switch (tone) {
    case 'info':
      return {
        dot: 'text-info',
        badge: 'border-info/20 bg-info/10 text-info',
      }
    case 'warning':
      return {
        dot: 'text-warning',
        badge: 'border-warning/25 bg-warning/12 text-warning',
      }
    case 'destructive':
      return {
        dot: 'text-destructive',
        badge: 'border-destructive/20 bg-destructive/10 text-destructive',
      }
    case 'success':
      return {
        dot: 'text-success',
        badge: 'border-success/20 bg-success/10 text-success',
      }
    default:
      return {
        dot: 'text-muted-foreground',
        badge: 'border-border bg-muted text-muted-foreground',
      }
  }
}

function getCampaignToneClassName(tone: CampaignTone) {
  return tone === 'success'
    ? 'bg-success/10 text-success rounded-full'
    : 'bg-info/10 text-info rounded-full'
}

function SystemHealthStatus({ status }: { status: 'Operational' | 'Degraded' }) {
  return (
    <span className={status === 'Operational' ? 'text-muted-foreground' : 'text-warning'}>
      {status}
    </span>
  )
}

function MetricsGrid({ metrics }: Pick<DashboardClientProps, 'metrics'>) {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {metrics.map((metric) => {
        const statCardProps = {
          ...(metric.trend !== undefined ? { trend: metric.trend } : {}),
          ...(metric.spark !== undefined ? { spark: metric.spark } : {}),
          ...(metric.accent !== undefined ? { accent: metric.accent } : {}),
        }

        return (
          <StatCard
            key={metric.label}
            label={metric.label.toUpperCase()}
            value={metric.value}
            className={dashboardCardClassName}
            {...statCardProps}
          />
        )
      })}
    </div>
  )
}

function RevenueCard({
  revenueSeries,
  revenueValueLabel,
  revenueTrendLabel,
}: Pick<DashboardClientProps, 'revenueSeries' | 'revenueValueLabel' | 'revenueTrendLabel'>) {
  return (
    <Card className={`${dashboardCardClassName} overflow-hidden`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 border-b px-5 py-4 sm:px-6">
        <div className="space-y-1">
          <CardTitle className="text-xl">Revenue (14d)</CardTitle>
          <Typography variant="body-sm" className="text-muted-foreground">
            Net of refunds
          </Typography>
        </div>
        <Button variant="ghost" size="sm" className={dashboardActionClassName}>
          Analytics
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pt-4 pb-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-foreground text-4xl font-semibold tracking-tight">
            {revenueValueLabel}
          </div>
          <div className="text-success text-sm font-medium">{revenueTrendLabel}</div>
        </div>

        <div className="h-[320px] w-full sm:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueSeries} margin={{ top: 18, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="adminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.42} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                stroke="var(--muted-foreground)"
                fontSize={12}
              />
              <YAxis hide domain={[0, 'dataMax + 8']} />
              <Tooltip
                cursor={{ stroke: 'var(--chart-1)', strokeDasharray: '4 4' }}
                contentStyle={{
                  borderRadius: '16px',
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--card)',
                  color: 'var(--card-foreground)',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--chart-1)"
                strokeWidth={3}
                fill="url(#adminRevenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function PendingApprovalsCard({
  pendingApprovals,
}: Pick<DashboardClientProps, 'pendingApprovals'>) {
  return (
    <Card className={dashboardCardClassName}>
      <CardHeader className="border-b px-5 py-4 sm:px-6">
        <CardTitle className="text-xl">Pending approvals</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {pendingApprovals.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 border-b px-5 py-4 last:border-b-0 sm:px-6"
          >
            <div className="bg-warning/12 text-warning flex size-11 shrink-0 items-center justify-center rounded-2xl">
              <ShieldCheck className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium">{item.label}</div>
            </div>
            <Badge variant="secondary" className={warningBadgeClassName}>
              {item.countLabel}
            </Badge>
            <ArrowRight className="text-muted-foreground size-4 shrink-0" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function SystemHealthCard({ systemHealth }: Pick<DashboardClientProps, 'systemHealth'>) {
  return (
    <Card className={dashboardCardClassName}>
      <CardHeader className="border-b px-5 py-4 sm:px-6">
        <div className="space-y-1">
          <CardTitle className="text-xl">System health</CardTitle>
          <Typography variant="body-sm" className="text-muted-foreground">
            Live status
          </Typography>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {systemHealth.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-b px-5 py-4 text-sm last:border-b-0 sm:px-6"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Circle
                className={
                  item.status === 'Operational'
                    ? 'text-success size-3 fill-current'
                    : 'text-warning size-3 fill-current'
                }
              />
              <span className="truncate font-medium">{item.label}</span>
              <SystemHealthStatus status={item.status} />
            </div>
            <span className="text-muted-foreground">{item.uptimeLabel}</span>
            <span className="text-muted-foreground text-right">{item.latencyLabel}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ModerationQueueCard({ moderationQueue }: Pick<DashboardClientProps, 'moderationQueue'>) {
  return (
    <Card className={dashboardCardClassName}>
      <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-4 sm:px-6">
        <CardTitle className="text-xl">Moderation queue</CardTitle>
        <Button variant="ghost" size="sm" className={dashboardActionClassName}>
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {moderationQueue.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[minmax(0,1.2fr)_auto_auto] items-center gap-3 border-b px-5 py-4 last:border-b-0 sm:px-6"
          >
            <div className="truncate font-medium">{item.sellerName}</div>
            <div className="text-muted-foreground text-sm">{item.stateLabel}</div>
            <div className="flex items-center gap-3 justify-self-end">
              <Badge variant="secondary" className={warningBadgeClassName}>
                {item.tagLabel}
              </Badge>
              <span className="text-muted-foreground text-sm">{item.dateLabel}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function DisputeQueueCard({ disputeQueue }: Pick<DashboardClientProps, 'disputeQueue'>) {
  return (
    <Card className={dashboardCardClassName}>
      <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-4 sm:px-6">
        <CardTitle className="text-xl">Dispute queue</CardTitle>
        <Button variant="ghost" size="sm" className={dashboardActionClassName}>
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {disputeQueue.map((item) => {
          const tone = getDisputeToneClassNames(item.tone)

          return (
            <div
              key={item.id}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 border-b px-5 py-4 last:border-b-0 sm:px-6"
            >
              <Circle className={`size-3 fill-current ${tone.dot}`} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{item.ticket}</span>
                  <span className="text-muted-foreground truncate">{item.counterparties}</span>
                </div>
              </div>
              <Badge variant="outline" className={`rounded-full border ${tone.badge}`}>
                {item.stateLabel}
              </Badge>
              <span className="text-primary text-right font-semibold">{item.amountLabel}</span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

function CampaignsCard({ campaigns }: Pick<DashboardClientProps, 'campaigns'>) {
  return (
    <Card className={dashboardCardClassName}>
      <CardHeader className="border-b px-5 py-4 sm:px-6">
        <CardTitle className="text-xl">Active campaigns</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-5 py-5 sm:px-6">
        {campaigns.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-2xl">
              <Megaphone className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium">{item.name}</div>
              <div className="text-muted-foreground text-sm">{item.detail}</div>
            </div>
            <Badge variant="secondary" className={getCampaignToneClassName(item.tone)}>
              {item.statusLabel}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function AuditEventsCard({ auditEvents }: Pick<DashboardClientProps, 'auditEvents'>) {
  return (
    <Card className={dashboardCardClassName}>
      <CardHeader className="border-b px-5 py-4 sm:px-6">
        <div className="space-y-1">
          <CardTitle className="text-xl">Recent audit events</CardTitle>
          <Typography variant="body-sm" className="text-muted-foreground">
            Live, last 24h
          </Typography>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-5 py-5 sm:px-6">
        {auditEvents.map((item) => (
          <div key={item.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3">
            <div className="pt-1">
              <div className="border-warning/25 flex size-4 items-center justify-center rounded-full border">
                <div className="bg-primary size-2 rounded-full" />
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-sm">
                <span className="font-semibold">{item.actor}</span>
                <span className="text-muted-foreground"> {item.action} </span>
                <span className="font-semibold">{item.subject}</span>
              </div>
              {item.detail ? (
                <div className="text-muted-foreground text-sm">{item.detail}</div>
              ) : null}
            </div>
            <div className="text-muted-foreground text-sm">{item.dateLabel}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function DashboardClient({
  metrics,
  revenueSeries,
  revenueValueLabel,
  revenueTrendLabel,
  pendingApprovals,
  systemHealth,
  moderationQueue,
  disputeQueue,
  campaigns,
  auditEvents,
}: DashboardClientProps) {
  return (
    <div className="space-y-5">
      <MetricsGrid metrics={metrics} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_minmax(22rem,1fr)]">
        <RevenueCard
          revenueSeries={revenueSeries}
          revenueValueLabel={revenueValueLabel}
          revenueTrendLabel={revenueTrendLabel}
        />

        <div className="space-y-4">
          <PendingApprovalsCard pendingApprovals={pendingApprovals} />
          <SystemHealthCard systemHealth={systemHealth} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ModerationQueueCard moderationQueue={moderationQueue} />
        <DisputeQueueCard disputeQueue={disputeQueue} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <CampaignsCard campaigns={campaigns} />
        <AuditEventsCard auditEvents={auditEvents} />
      </div>

      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Activity className="size-4" />
        <span>Logged in as Ops Admin | 3 active admins | 24 orders today</span>
      </div>
    </div>
  )
}

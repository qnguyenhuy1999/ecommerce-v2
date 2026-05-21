import { Button, ConsolePageLayout } from '@ecom/core-ui'
import { dashboardDefaultProps } from './Dashboard.fixtures'
import { DashboardClient } from './Dashboard.client'
import type { DashboardProps } from './Dashboard.types'

export function Dashboard({
  title = dashboardDefaultProps.title,
  description = dashboardDefaultProps.description,
  exportReportHref = dashboardDefaultProps.exportReportHref,
  openQueueHref = dashboardDefaultProps.openQueueHref,
  metrics = dashboardDefaultProps.metrics,
  revenueSeries = dashboardDefaultProps.revenueSeries,
  revenueValueLabel = dashboardDefaultProps.revenueValueLabel,
  revenueTrendLabel = dashboardDefaultProps.revenueTrendLabel,
  pendingApprovals = dashboardDefaultProps.pendingApprovals,
  systemHealth = dashboardDefaultProps.systemHealth,
  moderationQueue = dashboardDefaultProps.moderationQueue,
  disputeQueue = dashboardDefaultProps.disputeQueue,
  campaigns = dashboardDefaultProps.campaigns,
  auditEvents = dashboardDefaultProps.auditEvents,
}: DashboardProps) {
  return (
    <ConsolePageLayout
      title={title}
      description={description}
      actions={
        <>
          <Button asChild variant="outline" className="rounded-2xl">
            <a href={exportReportHref}>Export report</a>
          </Button>
          <Button asChild className="rounded-2xl">
            <a href={openQueueHref}>Open queue</a>
          </Button>
        </>
      }
      mainClassName="space-y-5"
    >
      <DashboardClient
        metrics={metrics}
        revenueSeries={revenueSeries}
        revenueValueLabel={revenueValueLabel}
        revenueTrendLabel={revenueTrendLabel}
        pendingApprovals={pendingApprovals}
        systemHealth={systemHealth}
        moderationQueue={moderationQueue}
        disputeQueue={disputeQueue}
        campaigns={campaigns}
        auditEvents={auditEvents}
      />
    </ConsolePageLayout>
  )
}

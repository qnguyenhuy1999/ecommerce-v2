import { Button, ConsolePageLayout } from '@ecom/core-ui'
import { ArrowRight } from 'lucide-react'
import { dashboardDefaultProps } from './Dashboard.fixtures'
import type { DashboardProps } from './Dashboard.types'
import { DashboardMetricsSection } from './DashboardMetricsSection'
import { DashboardRevenueAndTodoSection } from './DashboardRevenueAndTodoSection'
import { DashboardOperationsSection } from './DashboardOperationsSection'
import { DashboardInsightsSection } from './DashboardInsightsSection'

export function Dashboard({
  snapshotLabel = dashboardDefaultProps.snapshotLabel,
  ordersHref = dashboardDefaultProps.ordersHref,
  metrics = dashboardDefaultProps.metrics,
  revenueSeries = dashboardDefaultProps.revenueSeries,
  todos = dashboardDefaultProps.todos,
  pendingOrders = dashboardDefaultProps.pendingOrders,
  lowStockItems = dashboardDefaultProps.lowStockItems,
  promotions = dashboardDefaultProps.promotions,
  topProducts = dashboardDefaultProps.topProducts,
  recentActivity = dashboardDefaultProps.recentActivity,
}: DashboardProps) {
  return (
    <ConsolePageLayout
      title="Today"
      description={snapshotLabel}
      actions={
        <Button asChild size="sm" variant="ghost">
          <a href={ordersHref}>
            View all orders
            <ArrowRight />
          </a>
        </Button>
      }
      mainClassName="space-y-5"
    >
      <DashboardMetricsSection metrics={metrics} />
      <DashboardRevenueAndTodoSection revenueSeries={revenueSeries} todos={todos} />
      <DashboardOperationsSection
        pendingOrders={pendingOrders}
        lowStockItems={lowStockItems}
        promotions={promotions}
      />
      <DashboardInsightsSection topProducts={topProducts} recentActivity={recentActivity} />
    </ConsolePageLayout>
  )
}

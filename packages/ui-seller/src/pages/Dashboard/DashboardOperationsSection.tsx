import { Badge, Button, Progress, Typography } from '@ecom/core-ui'
import { CircleDashed } from 'lucide-react'
import { SectionCard } from '../../atoms/SectionCard'
import { cn } from '@ecom/shared/utils'
import { formatDashboardNumber } from '../../pages/Dashboard/Dashboard.utils'
import type { DashboardProps } from './Dashboard.types'
import { ProductStatusPill } from '../../atoms/ProductStatusPill'

export function DashboardOperationsSection({
  pendingOrders,
  lowStockItems,
  promotions,
}: {
  pendingOrders: NonNullable<DashboardProps['pendingOrders']>
  lowStockItems: NonNullable<DashboardProps['lowStockItems']>
  promotions: NonNullable<DashboardProps['promotions']>
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <SectionCard title="Pending orders" subtitle="Awaiting fulfilment" padded={false}>
        <div>
          {pendingOrders.map((order, index) => (
            <div
              key={order.id}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5',
                index !== 0 && 'border-border border-t',
              )}
            >
              <img
                alt={order.id}
                className="size-12 rounded-xl object-cover"
                loading="lazy"
                src={order.imageUrl}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{order.id}</span>
                  <ProductStatusPill variant="shipping" size="sm">
                    {order.status}
                  </ProductStatusPill>
                </div>
                <Typography variant="caption" className="text-muted-foreground">
                  {order.customer}
                </Typography>
              </div>
              <div className="text-right text-sm font-semibold tabular-nums">{order.amount}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Low stock" subtitle="Restock soon" padded={false}>
        <div>
          {lowStockItems.map((item, index) => (
            <div
              key={item.sku}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5',
                index !== 0 && 'border-border border-t',
              )}
            >
              <img
                alt={item.name}
                className="size-12 rounded-xl object-cover"
                loading="lazy"
                src={item.imageUrl}
              />
              <div className="min-w-0 flex-1">
                <Typography variant="label" className="truncate text-sm">
                  {item.name}
                </Typography>
                <Typography variant="caption" className="text-muted-foreground">
                  {item.sku} - {item.remaining} left
                </Typography>
              </div>
              <Button size="xs" variant="outline">
                Restock
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Promotion performance" padded={false}>
        <div>
          {promotions.map((promotion, index) => {
            const progressValue = Math.round((promotion.redeemed / promotion.total) * 100)

            return (
              <div
                key={promotion.name}
                className={cn('space-y-3 px-4 py-3.5', index !== 0 && 'border-border border-t')}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <CircleDashed className="text-success size-4 shrink-0" />
                    <span className="truncate text-sm font-medium">{promotion.name}</span>
                  </div>
                  <Badge className="text-success" variant="secondary">
                    {promotion.status}
                  </Badge>
                </div>
                <div className="text-muted-foreground flex items-center justify-between gap-3 text-xs">
                  <span>
                    {formatDashboardNumber(promotion.redeemed)} /{' '}
                    {formatDashboardNumber(promotion.total)} redeemed
                  </span>
                  <span className="tabular-nums">{progressValue}%</span>
                </div>
                <Progress value={progressValue} />
              </div>
            )
          })}
        </div>
      </SectionCard>
    </section>
  )
}

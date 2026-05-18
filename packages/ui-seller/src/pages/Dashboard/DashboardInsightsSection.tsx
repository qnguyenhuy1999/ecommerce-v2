import { Avatar, AvatarFallback, AvatarImage } from '@ecom/core-ui'
import { SectionCard } from '../../atoms/SectionCard'
import { cn } from '../../lib/utils'
import { type DashboardProps } from './Dashboard.types'

export function DashboardInsightsSection({
  topProducts,
  recentActivity,
}: {
  topProducts: NonNullable<DashboardProps['topProducts']>
  recentActivity: NonNullable<DashboardProps['recentActivity']>
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <SectionCard title="Top products this week" padded={false}>
        <div>
          {topProducts.map((product, index) => (
            <div
              key={product.rank}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5',
                index !== 0 && 'border-border border-t',
              )}
            >
              <span className="bg-primary/8 text-primary inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                {product.rank}
              </span>
              <Avatar className="rounded-xl" size="lg">
                <AvatarImage alt={product.name} className="rounded-xl" src={product.imageUrl} />
                <AvatarFallback className="rounded-xl">P{product.rank}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="text-muted-foreground text-xs">{product.sold} sold</p>
              </div>
              <div className="text-primary text-sm font-semibold tabular-nums">
                {product.revenue}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Recent activity" padded={false}>
        <div>
          {recentActivity.map((activity, index) => (
            <div
              key={`${activity.title}-${activity.time}`}
              className={cn(
                'flex items-start gap-3 px-4 py-3.5',
                index !== 0 && 'border-border border-t',
              )}
            >
              <span className="bg-primary mt-1 size-2 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-muted-foreground text-xs">{activity.detail}</p>
              </div>
              <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>
    </section>
  )
}

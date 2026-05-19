'use client'

import {
  Users,
  Store,
  Clock,
  UserCheck,
  ShoppingCart,
  Package,
  RotateCcw,
  Star,
} from 'lucide-react'
import { useDashboardMetrics } from '../hooks/use-dashboard'
import { StatCard as MetricCard } from '@ecom/core-ui'
import { StatusBadge } from '@ecom/core-ui'

export function DashboardPage() {
  const { data, isLoading } = useDashboardMetrics()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your marketplace</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Users"
          value={data?.totalUsers ?? 0}
          icon={Users}
          loading={isLoading}
        />
        <MetricCard
          label="Total Sellers"
          value={data?.totalSellers ?? 0}
          icon={Store}
          loading={isLoading}
        />
        <MetricCard
          label="Active Sellers"
          value={data?.activeSellers ?? 0}
          icon={UserCheck}
          loading={isLoading}
        />
        <MetricCard
          label="Pending Approvals"
          value={data?.pendingSellers ?? 0}
          icon={Clock}
          description="Sellers awaiting review"
          loading={isLoading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Orders"
          value={data?.totalOrders ?? 0}
          icon={ShoppingCart}
          loading={isLoading}
        />
        <MetricCard
          label="Total Products"
          value={data?.totalProducts ?? 0}
          icon={Package}
          loading={isLoading}
        />
        <MetricCard
          label="Pending Refunds"
          value={data?.pendingRefunds ?? 0}
          icon={RotateCcw}
          description="Refunds awaiting review"
          loading={isLoading}
        />
        <MetricCard
          label="Total Reviews"
          value={data?.totalReviews ?? 0}
          icon={Star}
          loading={isLoading}
        />
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">Recent Sellers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b text-left">
                <th className="text-muted-foreground px-6 py-3 font-medium">Shop Name</th>
                <th className="text-muted-foreground px-6 py-3 font-medium">Email</th>
                <th className="text-muted-foreground px-6 py-3 font-medium">Status</th>
                <th className="text-muted-foreground px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <td key={j} className="px-6 py-3">
                          <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data?.recentSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-muted/50 border-b">
                      <td className="px-6 py-3 font-medium">{seller.shopName}</td>
                      <td className="text-muted-foreground px-6 py-3">{seller.user.email}</td>
                      <td className="px-6 py-3">
                        <StatusBadge status={seller.status} />
                      </td>
                      <td className="text-muted-foreground px-6 py-3">
                        {new Date(seller.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              {!isLoading && !data?.recentSellers.length && (
                <tr>
                  <td colSpan={4} className="text-muted-foreground px-6 py-8 text-center">
                    No sellers yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

'use client';

import {
  Users, Store, Clock, UserCheck, ShoppingCart,
  Package, RotateCcw, Star,
} from 'lucide-react';
import { useDashboardMetrics } from '../hooks/use-dashboard';
import { StatCard as MetricCard } from '@ecom/core-ui';
import { StatusBadge } from '@ecom/core-ui';

export function DashboardPage() {
  const { data, isLoading } = useDashboardMetrics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your marketplace
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={data?.totalUsers ?? 0}
          icon={Users}
          loading={isLoading}
        />
        <MetricCard
          title="Total Sellers"
          value={data?.totalSellers ?? 0}
          icon={Store}
          loading={isLoading}
        />
        <MetricCard
          title="Active Sellers"
          value={data?.activeSellers ?? 0}
          icon={UserCheck}
          loading={isLoading}
        />
        <MetricCard
          title="Pending Approvals"
          value={data?.pendingSellers ?? 0}
          icon={Clock}
          description="Sellers awaiting review"
          loading={isLoading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Orders"
          value={data?.totalOrders ?? 0}
          icon={ShoppingCart}
          loading={isLoading}
        />
        <MetricCard
          title="Total Products"
          value={data?.totalProducts ?? 0}
          icon={Package}
          loading={isLoading}
        />
        <MetricCard
          title="Pending Refunds"
          value={data?.pendingRefunds ?? 0}
          icon={RotateCcw}
          description="Refunds awaiting review"
          loading={isLoading}
        />
        <MetricCard
          title="Total Reviews"
          value={data?.totalReviews ?? 0}
          icon={Star}
          loading={isLoading}
        />
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">Recent Sellers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-6 py-3 font-medium text-muted-foreground">Shop Name</th>
                <th className="px-6 py-3 font-medium text-muted-foreground">Email</th>
                <th className="px-6 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-3 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <td key={j} className="px-6 py-3">
                          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data?.recentSellers.map((seller) => (
                    <tr key={seller.id} className="border-b hover:bg-muted/50">
                      <td className="px-6 py-3 font-medium">{seller.shopName}</td>
                      <td className="px-6 py-3 text-muted-foreground">{seller.user.email}</td>
                      <td className="px-6 py-3"><StatusBadge status={seller.status} /></td>
                      <td className="px-6 py-3 text-muted-foreground">{new Date(seller.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
              {!isLoading && !data?.recentSellers.length && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No sellers yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

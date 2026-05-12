'use client'

import { useState, useEffect } from 'react'
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { StatCard } from '@ecom/core-ui'
import { api } from '../../lib/api'

interface DashboardSummary {
  revenue: { current: number; previous: number; growth: number }
  pendingOrders: number
  activeProducts: number
  lowStockCount: number
}

interface RevenueData {
  totalRevenue: number
  orderCount: number
  averageOrderValue: number
  dailyRevenue: { date: string; revenue: number }[]
}

interface ProductPerformance {
  productName: string
  unitsSold: number
  revenue: number
  orders: number
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [revenue, setRevenue] = useState<RevenueData | null>(null)
  const [topProducts, setTopProducts] = useState<ProductPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const endDate = new Date().toISOString()
      const startDate = new Date(Date.now() - Number(dateRange) * 24 * 60 * 60 * 1000).toISOString()
      try {
        const [summaryRes, revenueRes, productsRes] = await Promise.all([
          api<DashboardSummary>('/analytics/dashboard'),
          api<RevenueData>('/analytics/revenue', { params: { startDate, endDate } }),
          api<ProductPerformance[]>('/analytics/products', { params: { startDate, endDate } }),
        ])
        setSummary(summaryRes)
        setRevenue(revenueRes)
        setTopProducts(productsRes)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [dateRange])

  return (
    <DashboardLayout>
      <PageHeader
        title="Analytics"
        description="Track your store performance"
        actions={
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        }
      />

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-gray-200" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Revenue"
              value={`$${(summary?.revenue.current ?? 0).toLocaleString()}`}
              icon={DollarSign}
              {...(summary?.revenue.growth !== undefined ? { trend: summary.revenue.growth } : {})}
            />
            <StatCard
              label="Orders"
              value={(revenue?.orderCount ?? 0).toString()}
              icon={ShoppingCart}
            />
            <StatCard
              label="Avg Order Value"
              value={`$${(revenue?.averageOrderValue ?? 0).toFixed(2)}`}
              icon={TrendingUp}
            />
            <StatCard
              label="Active Products"
              value={(summary?.activeProducts ?? 0).toString()}
              icon={Package}
            />
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Daily Revenue</h3>
              {revenue?.dailyRevenue.length ? (
                <div className="space-y-2">
                  {revenue.dailyRevenue.slice(-10).map((d) => (
                    <div key={d.date} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{d.date}</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 rounded bg-blue-500"
                          style={{
                            width: `${Math.min(200, (d.revenue / Math.max(...revenue.dailyRevenue.map((r) => r.revenue))) * 200)}px`,
                          }}
                        />
                        <span className="w-20 text-right font-medium">
                          ${d.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No revenue data</p>
              )}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Top Products</h3>
              {topProducts.length ? (
                <div className="space-y-3">
                  {topProducts.slice(0, 10).map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="w-5 text-gray-400">{idx + 1}.</span>
                        <span className="truncate">{p.productName}</span>
                      </div>
                      <div className="ml-4 flex items-center gap-4">
                        <span className="text-gray-500">{p.unitsSold} sold</span>
                        <span className="font-medium">${p.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No product data</p>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

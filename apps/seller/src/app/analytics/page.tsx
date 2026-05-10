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
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        }
      />

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Revenue"
              value={`$${(summary?.revenue.current ?? 0).toLocaleString()}`}
              icon={DollarSign}
              trend={summary?.revenue.growth}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue</h3>
              {revenue?.dailyRevenue.length ? (
                <div className="space-y-2">
                  {revenue.dailyRevenue.slice(-10).map((d) => (
                    <div key={d.date} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{d.date}</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 bg-blue-500 rounded"
                          style={{
                            width: `${Math.min(200, (d.revenue / Math.max(...revenue.dailyRevenue.map((r) => r.revenue))) * 200)}px`,
                          }}
                        />
                        <span className="font-medium w-20 text-right">
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

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
              {topProducts.length ? (
                <div className="space-y-3">
                  {topProducts.slice(0, 10).map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-gray-400 w-5">{idx + 1}.</span>
                        <span className="truncate">{p.productName}</span>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
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

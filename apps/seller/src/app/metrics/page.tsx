'use client'

import { useState, useEffect } from 'react'
import { Clock, RotateCcw, MessageSquare } from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { api } from '../../lib/api'

interface CurrentMetrics {
  period: { start: string; end: string }
  cancellationRate: number
  lateShipmentRate: number
  responseRate: number
  refundRate: number
  sellerScore: number
  totalOrders: number
  totalReturns: number
}

interface MetricSnapshot {
  id: string
  date: string
  cancellationRate: number
  lateShipmentRate: number
  responseRate: number
  refundRate: number
  sellerScore: number
  totalOrders: number
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<CurrentMetrics | null>(null)
  const [history, setHistory] = useState<MetricSnapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState('30')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [metricsRes, historyRes] = await Promise.all([
          api<CurrentMetrics>('/metrics'),
          api<MetricSnapshot[]>('/metrics/history', { params: { days } }),
        ])
        setMetrics(metricsRes)
        setHistory(historyRes)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    void fetchData()
  }, [days])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRateColor = (rate: number, inverse = false) => {
    if (inverse) {
      if (rate >= 90) return 'text-green-600'
      if (rate >= 70) return 'text-yellow-600'
      return 'text-red-600'
    }
    if (rate <= 2) return 'text-green-600'
    if (rate <= 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Performance Metrics"
        description="Monitor your seller performance score"
        actions={
          <select
            value={days}
            onChange={(e) => setDays(e.target.value)}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-gray-200" />
            ))}
          </div>
        </div>
      ) : (
        metrics && (
          <>
            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-8 text-center">
              <p className="mb-2 text-sm font-medium text-gray-500">Seller Score</p>
              <p className={`text-5xl font-bold ${getScoreColor(metrics.sellerScore)}`}>
                {metrics.sellerScore}
              </p>
              <p className="mt-2 text-sm text-gray-400">out of 100</p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-2 flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">Cancellation Rate</span>
                </div>
                <p className={`text-2xl font-bold ${getRateColor(metrics.cancellationRate)}`}>
                  {metrics.cancellationRate}%
                </p>
                <p className="mt-1 text-xs text-gray-400">Target: &lt; 2%</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">Late Shipment Rate</span>
                </div>
                <p className={`text-2xl font-bold ${getRateColor(metrics.lateShipmentRate)}`}>
                  {metrics.lateShipmentRate}%
                </p>
                <p className="mt-1 text-xs text-gray-400">Target: &lt; 3%</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-2 flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">Response Rate</span>
                </div>
                <p className={`text-2xl font-bold ${getRateColor(metrics.responseRate, true)}`}>
                  {metrics.responseRate}%
                </p>
                <p className="mt-1 text-xs text-gray-400">Target: &gt; 90%</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-2 flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">Refund Rate</span>
                </div>
                <p className={`text-2xl font-bold ${getRateColor(metrics.refundRate)}`}>
                  {metrics.refundRate}%
                </p>
                <p className="mt-1 text-xs text-gray-400">Target: &lt; 2%</p>
              </div>
            </div>

            {history.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Score History</h3>
                <div className="space-y-2">
                  {history.map((snap) => (
                    <div
                      key={snap.id}
                      className="flex items-center justify-between border-b border-gray-100 py-2 text-sm"
                    >
                      <span className="text-gray-600">
                        {new Date(snap.date).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-6">
                        <span className="text-gray-500">Orders: {snap.totalOrders}</span>
                        <span className={`font-medium ${getScoreColor(Number(snap.sellerScore))}`}>
                          Score: {Number(snap.sellerScore).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )
      )}
    </DashboardLayout>
  )
}

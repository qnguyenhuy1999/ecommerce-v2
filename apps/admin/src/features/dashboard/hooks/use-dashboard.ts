'use client'

import { useQuery } from '@tanstack/react-query'
import { getDashboardMetrics, getDashboardAnalytics } from '../api/dashboard.api'

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const res = await getDashboardMetrics()
      return res.data
    },
  })
}

export function useDashboardAnalytics(period?: string) {
  return useQuery({
    queryKey: ['dashboard-analytics', period],
    queryFn: async () => {
      const res = await getDashboardAnalytics(period)
      return res.data
    },
  })
}

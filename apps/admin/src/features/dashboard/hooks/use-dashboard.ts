'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardMetrics } from '../api/dashboard.api';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const res = await getDashboardMetrics();
      return res.data;
    },
  });
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '../api/audit-logs.api';

export function useAuditLogs(params: {
  page?: number;
  pageSize?: number;
  action?: string;
}) {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: async () => {
      const res = await getAuditLogs(params);
      return res.data;
    },
  });
}

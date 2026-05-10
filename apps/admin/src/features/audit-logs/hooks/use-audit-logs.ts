'use client'

import { useQuery } from '@tanstack/react-query'
import { getAuditLogs, type AuditLog } from '../api/audit-logs.api'
import type { PaginatedResponse } from '@ecom/shared/pagination/core'

export function useAuditLogs(params: { page?: number; limit?: number; action?: string }) {
  return useQuery<PaginatedResponse<AuditLog>>({
    queryKey: ['audit-logs', params],
    queryFn: async () => {
      const res = await getAuditLogs(params)
      return res.data
    },
  })
}

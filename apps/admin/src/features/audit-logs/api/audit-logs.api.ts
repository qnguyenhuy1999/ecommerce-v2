import { apiFetch } from '@/lib/api';
import type { PaginatedResponse } from '@ecom/shared/pagination/core';

export interface AuditLog {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  admin: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
}

export async function getAuditLogs(params: {
  page?: number;
  pageSize?: number;
  action?: string;
}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.pageSize) query.set('pageSize', String(params.pageSize));
  if (params.action) query.set('action', params.action);
  return apiFetch<{ success: boolean; data: PaginatedResponse<AuditLog> }>(
    `/admin/audit-logs?${query.toString()}`,
  );
}

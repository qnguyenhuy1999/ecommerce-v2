import { apiFetch } from '@/lib/api';
import type { PaginatedResponse } from '@ecom/common';

export interface VoucherListItem {
  id: string;
  code: string;
  name: string;
  type: string;
  status: string;
  discountValue: string;
  maxDiscountAmount: string | null;
  minOrderAmount: string | null;
  usageLimit: number | null;
  usedCount: number;
  startsAt: string;
  expiresAt: string;
  createdAt: string;
}

export async function getVouchers(params: { page?: number; pageSize?: number; status?: string; search?: string }) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.pageSize) query.set('pageSize', String(params.pageSize));
  if (params.status) query.set('status', params.status);
  if (params.search) query.set('search', params.search);
  return apiFetch<{ success: boolean; data: PaginatedResponse<VoucherListItem> }>(
    `/admin/promotions/vouchers?${query.toString()}`,
  );
}

export async function getVoucher(id: string) {
  return apiFetch<{ success: boolean; data: VoucherListItem }>(`/admin/promotions/vouchers/${id}`);
}

export async function getVoucherStatusCounts() {
  return apiFetch<{ success: boolean; data: Record<string, number> }>('/admin/promotions/vouchers/status-counts');
}

export async function createVoucher(data: Record<string, unknown>) {
  return apiFetch<{ success: boolean; data: VoucherListItem }>('/admin/promotions/vouchers', {
    method: 'POST', body: JSON.stringify(data),
  });
}

export async function updateVoucher(id: string, data: Record<string, unknown>) {
  return apiFetch<{ success: boolean; data: VoucherListItem }>(`/admin/promotions/vouchers/${id}`, {
    method: 'PUT', body: JSON.stringify(data),
  });
}

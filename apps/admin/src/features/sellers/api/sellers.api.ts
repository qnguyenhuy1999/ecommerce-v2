import { apiFetch } from '@/lib/api';
import type { PaginatedResponse } from '@ecom/shared/pagination/core';

export interface Seller {
  id: string;
  shopName: string;
  shopDescription: string | null;
  phone: string | null;
  address: string | null;
  status: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  suspendedAt: string | null;
  rejectReason: string | null;
  suspendReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; email: string; status: string };
}

export interface SellerDetail extends Seller {
  user: { id: string; email: string; status: string; createdAt: string };
  verifications: {
    id: string;
    documentType: string;
    documentUrl: string;
    status: string;
    adminNote: string | null;
    reviewedAt: string | null;
    createdAt: string;
  }[];
}

interface SellersResponse {
  success: boolean;
  data: PaginatedResponse<Seller>;
}

export async function getSellers(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.pageSize) query.set('pageSize', String(params.pageSize));
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  return apiFetch<SellersResponse>(`/admin/sellers?${query.toString()}`);
}

export async function getSellerById(id: string) {
  return apiFetch<{ success: boolean; data: SellerDetail }>(
    `/admin/sellers/${id}`,
  );
}

export async function approveSeller(id: string) {
  return apiFetch<{ success: boolean }>(`/admin/sellers/${id}/approve`, {
    method: 'POST',
  });
}

export async function rejectSeller(id: string, reason?: string) {
  return apiFetch<{ success: boolean }>(`/admin/sellers/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function suspendSeller(id: string, reason?: string) {
  return apiFetch<{ success: boolean }>(`/admin/sellers/${id}/suspend`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function getSellerStatusCounts() {
  return apiFetch<{ success: boolean; data: Record<string, number> }>(
    '/admin/sellers/status-counts',
  );
}

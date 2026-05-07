import { apiFetch } from '@/lib/api';
import type { PaginatedResponse } from '@ecom/common';

export interface OrderListItem {
  id: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  sellerOrders: {
    id: string;
    shop: { id: string; name: string };
    _count: { items: number };
  }[];
}

export interface OrderDetail extends Omit<OrderListItem, 'sellerOrders'> {
  sellerOrders: {
    id: string;
    status: string;
    subtotal: string;
    shop: { id: string; name: string };
    items: { id: string; productName: string; quantity: number; unitPrice: string; totalPrice: string }[];
    shipment: { id: string; status: string; trackingNumber: string | null } | null;
    auditLogs: { id: string; action: string; note: string | null; createdAt: string }[];
  }[];
}

export async function getOrders(params: {
  page?: number; pageSize?: number; search?: string; status?: string; buyerId?: string;
}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.pageSize) query.set('pageSize', String(params.pageSize));
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  if (params.buyerId) query.set('buyerId', params.buyerId);
  return apiFetch<{ success: boolean; data: PaginatedResponse<OrderListItem> }>(
    `/admin/orders?${query.toString()}`,
  );
}

export async function getOrder(id: string) {
  return apiFetch<{ success: boolean; data: OrderDetail }>(`/admin/orders/${id}`);
}

export async function getOrderStatusCounts() {
  return apiFetch<{ success: boolean; data: Record<string, number> }>('/admin/orders/status-counts');
}

export async function forceCancelOrder(id: string, reason?: string) {
  return apiFetch<{ success: boolean }>(`/admin/orders/${id}/force-cancel`, {
    method: 'POST', body: JSON.stringify({ reason }),
  });
}

export async function forceCompleteOrder(id: string) {
  return apiFetch<{ success: boolean }>(`/admin/orders/${id}/force-complete`, { method: 'POST' });
}

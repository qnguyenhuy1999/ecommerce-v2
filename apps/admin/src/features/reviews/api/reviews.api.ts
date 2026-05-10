import { apiFetch } from '@/lib/api';
import type { PaginatedResponse } from '@ecom/shared/pagination/core';

export interface ReviewListItem {
  id: string;
  rating: number;
  comment: string | null;
  status: string;
  createdAt: string;
  images: { id: string; url: string }[];
  reports: { id: string }[];
  _count: { reports: number };
}

export async function getReviews(params: { page?: number; pageSize?: number; status?: string }) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.pageSize) query.set('pageSize', String(params.pageSize));
  if (params.status) query.set('status', params.status);
  return apiFetch<{ success: boolean; data: PaginatedResponse<ReviewListItem> }>(
    `/admin/reviews?${query.toString()}`,
  );
}

export async function getReviewStatusCounts() {
  return apiFetch<{ success: boolean; data: Record<string, number> }>('/admin/reviews/status-counts');
}

export async function approveReview(id: string) {
  return apiFetch<{ success: boolean }>(`/admin/reviews/${id}/approve`, { method: 'POST' });
}

export async function hideReview(id: string) {
  return apiFetch<{ success: boolean }>(`/admin/reviews/${id}/hide`, { method: 'POST' });
}

export async function rejectReview(id: string) {
  return apiFetch<{ success: boolean }>(`/admin/reviews/${id}/reject`, { method: 'POST' });
}

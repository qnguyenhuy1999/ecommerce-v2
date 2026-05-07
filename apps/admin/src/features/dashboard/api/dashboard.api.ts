import { apiFetch } from '@/lib/api';

export interface DashboardMetrics {
  totalSellers: number;
  activeSellers: number;
  pendingSellers: number;
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  pendingRefunds: number;
  totalReviews: number;
  recentSellers: {
    id: string;
    shopName: string;
    status: string;
    createdAt: string;
    user: { email: string };
  }[];
}

export interface DashboardAnalytics {
  ordersByDay: { status: string; _count: { id: number }; _sum: { totalAmount: string | null } }[];
  topCategories: { categoryId: string; _count: { id: number } }[];
}

export async function getDashboardMetrics() {
  return apiFetch<{ success: boolean; data: DashboardMetrics }>(
    '/admin/dashboard/metrics',
  );
}

export async function getDashboardAnalytics(period?: string) {
  const query = period ? `?period=${period}` : '';
  return apiFetch<{ success: boolean; data: DashboardAnalytics }>(
    `/admin/dashboard/analytics${query}`,
  );
}

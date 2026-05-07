import { apiFetch } from '@/lib/api';

export interface DashboardMetrics {
  totalSellers: number;
  activeSellers: number;
  pendingSellers: number;
  totalUsers: number;
  recentSellers: {
    id: string;
    shopName: string;
    status: string;
    createdAt: string;
    user: { email: string };
  }[];
}

export async function getDashboardMetrics() {
  return apiFetch<{ success: boolean; data: DashboardMetrics }>(
    '/admin/dashboard/metrics',
  );
}

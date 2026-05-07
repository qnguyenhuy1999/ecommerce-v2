import { Injectable } from '@nestjs/common';
import { prisma } from '@ecom/database';

@Injectable()
export class DashboardService {
  async getMetrics() {
    const [
      totalSellers,
      activeSellers,
      pendingSellers,
      totalUsers,
      totalOrders,
      totalProducts,
      pendingRefunds,
      totalReviews,
      recentSellers,
    ] = await Promise.all([
      prisma.seller.count({ where: { deletedAt: null } }),
      prisma.seller.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.seller.count({ where: { status: 'PENDING', deletedAt: null } }),
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.returnRequest.count({ where: { status: { in: ['REQUESTED', 'REVIEWING'] } } }),
      prisma.review.count(),
      prisma.seller.findMany({
        where: { deletedAt: null },
        include: { user: { select: { email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      totalSellers,
      activeSellers,
      pendingSellers,
      totalUsers,
      totalOrders,
      totalProducts,
      pendingRefunds,
      totalReviews,
      recentSellers,
    };
  }

  async getAnalytics(period: string = '30d') {
    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [ordersByDay, topCategories] = await Promise.all([
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
        _sum: { totalAmount: true },
        where: { createdAt: { gte: since } },
      }),
      prisma.product.groupBy({
        by: ['categoryId'],
        _count: { id: true },
        where: { deletedAt: null, categoryId: { not: null } },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ]);

    return { ordersByDay, topCategories };
  }
}

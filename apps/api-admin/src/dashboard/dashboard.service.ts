import { Injectable } from '@nestjs/common'
import type { PrismaService } from '@ecom/database'

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}
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
      this.prisma.seller.count({ where: { deletedAt: null } }),
      this.prisma.seller.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      this.prisma.seller.count({ where: { status: 'PENDING', deletedAt: null } }),
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.product.count({ where: { deletedAt: null } }),
      this.prisma.returnRequest.count({ where: { status: { in: ['REQUESTED', 'REVIEWING'] } } }),
      this.prisma.review.count(),
      this.prisma.seller.findMany({
        where: { deletedAt: null },
        include: { user: { select: { email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

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
    }
  }

  async getAnalytics(period: string = '30d') {
    let days = 30
    if (period === '7d') days = 7
    else if (period === '90d') days = 90
    const since = new Date()
    since.setDate(since.getDate() - days)

    const [ordersByStatus, topCategories] = await Promise.all([
      this.prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
        _sum: { totalAmount: true },
        where: { createdAt: { gte: since } },
      }),
      this.prisma.product.groupBy({
        by: ['categoryId'],
        _count: { id: true },
        where: { deletedAt: null, categoryId: { not: null } },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ])

    return { ordersByStatus, topCategories }
  }
}

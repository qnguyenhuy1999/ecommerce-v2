import { Injectable } from '@nestjs/common'
import { PrismaService } from '@ecom/database'

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}
  async getRevenueAnalytics(shopId: string, startDate: Date, endDate: Date) {
    const orders = await this.prisma.sellerOrder.findMany({
      where: {
        shopId,
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['CONFIRMED', 'PACKING', 'SHIPPED', 'DELIVERED'] },
      },
      select: { subtotal: true, createdAt: true, status: true },
      orderBy: { createdAt: 'asc' },
    })

    const totalRevenue = orders.reduce((sum: number, o) => sum + Number(o.subtotal), 0)
    const dailyRevenue: Record<string, number> = {}
    for (const order of orders) {
      const day = order.createdAt.toISOString().split('T')[0]
      dailyRevenue[day] = (dailyRevenue[day] ?? 0) + Number(order.subtotal)
    }

    return {
      totalRevenue,
      orderCount: orders.length,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      dailyRevenue: Object.entries(dailyRevenue).map(([date, revenue]) => ({ date, revenue })),
    }
  }

  async getOrderAnalytics(shopId: string, startDate: Date, endDate: Date) {
    const statusCounts = await this.prisma.sellerOrder.groupBy({
      by: ['status'],
      where: { shopId, createdAt: { gte: startDate, lte: endDate } },
      _count: true,
    })

    const total = statusCounts.reduce((sum: number, s: { _count: number }) => sum + s._count, 0)

    return {
      total,
      byStatus: statusCounts.map((s: { status: string; _count: number }) => ({
        status: s.status,
        count: s._count,
      })),
    }
  }

  async getProductPerformance(shopId: string, startDate: Date, endDate: Date) {
    const topProducts = await this.prisma.sellerOrderItem.groupBy({
      by: ['variantId'],
      where: {
        sellerOrder: { shopId, createdAt: { gte: startDate, lte: endDate } },
      },
      _sum: { quantity: true, totalPrice: true },
      _count: true,
      orderBy: { _sum: { totalPrice: 'desc' } },
      take: 20,
    })

    return topProducts.map(
      (p: {
        variantId: string
        _sum: { quantity: number | null; totalPrice: number | null }
        _count: number
      }) => ({
        variantId: p.variantId,
        unitsSold: p._sum.quantity ?? 0,
        revenue: Number(p._sum.totalPrice ?? 0),
        orders: p._count,
      }),
    )
  }

  async getConversionMetrics(shopId: string, startDate: Date, endDate: Date) {
    const [totalOrders, deliveredOrders, cancelledOrders] = await Promise.all([
      this.prisma.sellerOrder.count({
        where: { shopId, createdAt: { gte: startDate, lte: endDate } },
      }),
      this.prisma.sellerOrder.count({
        where: { shopId, status: 'DELIVERED', createdAt: { gte: startDate, lte: endDate } },
      }),
      this.prisma.sellerOrder.count({
        where: { shopId, status: 'CANCELLED', createdAt: { gte: startDate, lte: endDate } },
      }),
    ])

    return {
      totalOrders,
      deliveredOrders,
      cancelledOrders,
      fulfillmentRate: totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0,
      cancellationRate: totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0,
    }
  }

  async getDashboardSummary(shopId: string) {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    const [currentRevenue, previousRevenue, pendingOrders, activeProducts, lowStockCount] =
      await Promise.all([
        this.prisma.sellerOrder
          .aggregate({
            where: {
              shopId,
              createdAt: { gte: thirtyDaysAgo },
              status: { in: ['CONFIRMED', 'PACKING', 'SHIPPED', 'DELIVERED'] },
            },
            _sum: { subtotal: true },
          })
          .then((r) => Number(r._sum.subtotal ?? 0)),
        this.prisma.sellerOrder
          .aggregate({
            where: {
              shopId,
              createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
              status: { in: ['CONFIRMED', 'PACKING', 'SHIPPED', 'DELIVERED'] },
            },
            _sum: { subtotal: true },
          })
          .then((r) => Number(r._sum.subtotal ?? 0)),
        this.prisma.sellerOrder.count({ where: { shopId, status: 'PENDING' } }),
        this.prisma.product.count({ where: { shopId, status: 'PUBLISHED', deletedAt: null } }),
        this.prisma.productVariant.count({
          where: { product: { shopId, deletedAt: null }, stock: { lte: 10 } },
        }),
      ])

    const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0

    return {
      revenue: { current: currentRevenue, previous: previousRevenue, growth: revenueGrowth },
      pendingOrders,
      activeProducts,
      lowStockCount,
    }
  }
}

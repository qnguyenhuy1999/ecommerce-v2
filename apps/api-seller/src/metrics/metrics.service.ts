import { Injectable } from '@nestjs/common'
import { PrismaService, Prisma } from '@ecom/database'
import { OrderStatus, RefundStatus } from '@ecom/contracts'

@Injectable()
export class MetricsService {
  constructor(private readonly prisma: PrismaService) {}
  async getCurrentMetrics(shopId: string) {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [totalOrders, cancelledOrders, lateShipments, totalReturns, refundedOrders] =
      await Promise.all([
        this.prisma.sellerOrder.count({
          where: { shopId, createdAt: { gte: thirtyDaysAgo } },
        }),
        this.prisma.sellerOrder.count({
          where: { shopId, status: OrderStatus.CANCELLED, createdAt: { gte: thirtyDaysAgo } },
        }),
        this.prisma.sellerOrder.count({
          where: {
            shopId,
            status: OrderStatus.SHIPPED,
            createdAt: { gte: thirtyDaysAgo },
            shippedAt: { not: null },
          },
        }),
        this.prisma.returnRequest.count({
          where: { shopId, createdAt: { gte: thirtyDaysAgo } },
        }),
        this.prisma.returnRequest.count({
          where: { shopId, status: RefundStatus.REFUNDED as any, createdAt: { gte: thirtyDaysAgo } },
        }),
      ])

    const cancellationRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0
    const refundRate = totalOrders > 0 ? (refundedOrders / totalOrders) * 100 : 0

    const conversations = await this.prisma.conversation.findMany({
      where: { shopId, createdAt: { gte: thirtyDaysAgo } },
      select: { sellerUnread: true },
    })
    const totalConversations = conversations.length
    const respondedConversations = conversations.filter((c: { sellerUnread: number }) => c.sellerUnread === 0).length
    const responseRate = totalConversations > 0 ? (respondedConversations / totalConversations) * 100 : 100

    const sellerScore = Math.max(
      0,
      Math.min(100, 100 - cancellationRate * 2 - refundRate * 1.5 + (responseRate > 90 ? 10 : 0)),
    )

    return {
      period: { start: thirtyDaysAgo.toISOString(), end: now.toISOString() },
      cancellationRate: Math.round(cancellationRate * 100) / 100,
      lateShipmentRate: totalOrders > 0 ? Math.round((lateShipments / totalOrders) * 10000) / 100 : 0,
      responseRate: Math.round(responseRate * 100) / 100,
      refundRate: Math.round(refundRate * 100) / 100,
      sellerScore: Math.round(sellerScore * 100) / 100,
      totalOrders,
      totalReturns,
    }
  }

  async getMetricHistory(shopId: string, days: number = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const snapshots = await this.prisma.sellerMetricSnapshot.findMany({
      where: { shopId, date: { gte: startDate } },
      orderBy: { date: 'asc' },
    })

    return snapshots
  }

  async takeSnapshot(shopId: string) {
    const metrics = await this.getCurrentMetrics(shopId)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return this.prisma.sellerMetricSnapshot.upsert({
      where: { shopId_date: { shopId, date: today } },
      create: {
        shopId,
        date: today,
        cancellationRate: new Prisma.Decimal(metrics.cancellationRate),
        lateShipmentRate: new Prisma.Decimal(metrics.lateShipmentRate),
        responseRate: new Prisma.Decimal(metrics.responseRate),
        refundRate: new Prisma.Decimal(metrics.refundRate),
        sellerScore: new Prisma.Decimal(metrics.sellerScore),
        totalOrders: metrics.totalOrders,
        totalReturns: metrics.totalReturns,
      },
      update: {
        cancellationRate: new Prisma.Decimal(metrics.cancellationRate),
        lateShipmentRate: new Prisma.Decimal(metrics.lateShipmentRate),
        responseRate: new Prisma.Decimal(metrics.responseRate),
        refundRate: new Prisma.Decimal(metrics.refundRate),
        sellerScore: new Prisma.Decimal(metrics.sellerScore),
        totalOrders: metrics.totalOrders,
        totalReturns: metrics.totalReturns,
      },
    })
  }
}

import { Injectable } from '@nestjs/common'
import type { PrismaService } from '@ecom/database'
import { type Prisma, OrderStatus, ReturnStatus } from '@ecom/database'

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
          },
        }),
        this.prisma.returnRequest.count({
          where: { shopId, createdAt: { gte: thirtyDaysAgo } },
        }),
        this.prisma.returnRequest.count({
          where: {
            shopId,
            status: ReturnStatus.REFUNDED as NonNullable<Prisma.ReturnRequestWhereInput['status']>,
            createdAt: { gte: thirtyDaysAgo },
          },
        }),
      ])

    const cancellationRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0
    const refundRate = totalOrders > 0 ? (refundedOrders / totalOrders) * 100 : 0

    const conversations = await this.prisma.conversation.findMany({
      where: { shopId, createdAt: { gte: thirtyDaysAgo } },
      select: { sellerUnread: true },
    })
    const totalConversations = conversations.length
    const respondedConversations = conversations.filter(
      (c: { sellerUnread: number }) => c.sellerUnread === 0,
    ).length
    const responseRate =
      totalConversations > 0 ? (respondedConversations / totalConversations) * 100 : 100

    const sellerScore = Math.max(
      0,
      Math.min(100, 100 - cancellationRate * 2 - refundRate * 1.5 + (responseRate > 90 ? 10 : 0)),
    )

    return {
      period: { start: thirtyDaysAgo.toISOString(), end: now.toISOString() },
      cancellationRate: Math.round(cancellationRate * 100) / 100,
      lateShipmentRate:
        totalOrders > 0 ? Math.round((lateShipments / totalOrders) * 10000) / 100 : 0,
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
        cancellationRate: metrics.cancellationRate,
        lateShipmentRate: metrics.lateShipmentRate,
        responseRate: metrics.responseRate,
        refundRate: metrics.refundRate,
        sellerScore: metrics.sellerScore,
        totalOrders: metrics.totalOrders,
        totalRefunds: metrics.totalReturns,
      },
      update: {
        cancellationRate: metrics.cancellationRate,
        lateShipmentRate: metrics.lateShipmentRate,
        responseRate: metrics.responseRate,
        refundRate: metrics.refundRate,
        sellerScore: metrics.sellerScore,
        totalOrders: metrics.totalOrders,
        totalRefunds: metrics.totalReturns,
      },
    })
  }
}

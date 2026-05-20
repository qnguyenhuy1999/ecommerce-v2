import { PrismaService } from '@ecom/database'
import { type NotificationType } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { Injectable } from '@nestjs/common'
import type { NotificationQueryDto } from './dto/notification-query.dto'

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}
  async list(shopId: string, query: NotificationQueryDto) {
    const { page = 1, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT, unreadOnly, type } = query

    const where: Prisma.NotificationWhereInput = { shopId }
    if (unreadOnly) where.isRead = false
    if (type !== undefined) where.type = type

    const { items, total } = await offsetPaginate(this.prisma.notification, {
      page,
      limit,
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async getUnreadCount(shopId: string) {
    const count = await this.prisma.notification.count({
      where: { shopId, isRead: false },
    })
    return { count }
  }

  async markAsRead(shopId: string, notificationId: string) {
    await this.prisma.notification.updateMany({
      where: { id: notificationId, shopId },
      data: { isRead: true },
    })
  }

  async markAllAsRead(shopId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { shopId, isRead: false },
      data: { isRead: true },
    })
    return { updated: result.count }
  }

  async create(
    shopId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, unknown>,
  ) {
    const data: Prisma.NotificationUncheckedCreateInput = {
      shopId,
      type,
      title,
      message,
    }

    if (metadata !== undefined) {
      data.metadata = metadata as Prisma.InputJsonValue
    }

    return this.prisma.notification.create({
      data,
    })
  }
}

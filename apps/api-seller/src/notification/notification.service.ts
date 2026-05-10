import { Injectable } from '@nestjs/common'
import { PrismaService, Prisma } from '@ecom/database'
import { NotificationQueryDto } from './dto/notification-query.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}
  async list(shopId: string, query: NotificationQueryDto) {
    const { page = 1, pageSize = 20, unreadOnly, type } = query

    const where: Prisma.NotificationWhereInput = {
      shopId,
      ...(unreadOnly ? { isRead: false } : {}),
      ...(type ? { type: type as Prisma.NotificationWhereInput['type'] } : {}),
    }

    const { items, total } = await offsetPaginate(this.prisma.notification, {
      page,
      pageSize,
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, pageSize, total)
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

  async create(shopId: string, type: string, title: string, message: string, metadata?: Record<string, unknown>) {
    return this.prisma.notification.create({
      data: {
        shopId,
        type: type as Prisma.NotificationCreateInput['type'],
        title,
        message,
        metadata: metadata as Prisma.InputJsonValue,
      },
    })
  }
}

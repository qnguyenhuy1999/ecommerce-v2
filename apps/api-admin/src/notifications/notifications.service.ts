import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService, Prisma } from '@ecom/database'
import { type AdminNotificationStatus, type NotificationChannel } from '@ecom/database'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'
import { withDefined } from '@ecom/shared/utils'

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: { page?: number; limit?: number; status?: AdminNotificationStatus }) {
    const where: Prisma.AdminNotificationWhereInput = {}
    if (query.status) where.status = query.status

    const { items, total } = await offsetPaginate(this.prisma.adminNotification, {
      ...withDefined({ page: query.page, limit: query.limit }),
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, query.page ?? 1, query.limit ?? 20, total)
  }

  async findById(id: string) {
    const notification = await this.prisma.adminNotification.findUnique({ where: { id } })
    if (!notification) throw new NotFoundException('Notification not found')
    return notification
  }

  async create(data: {
    title: string
    message: string
    channel?: NotificationChannel
    targetAll?: boolean
    sentBy?: string
  }) {
    // Build create payload explicitly to avoid passing `undefined` values
    // to Prisma under exactOptionalPropertyTypes.
    const createData: Parameters<typeof this.prisma.adminNotification.create>[0]['data'] = {
      title: data.title,
      message: data.message,
      ...(data.channel !== undefined ? { channel: data.channel } : {}),
      ...(data.targetAll !== undefined ? { targetAll: data.targetAll } : {}),
      ...(data.sentBy !== undefined ? { sentBy: data.sentBy } : {}),
    }
    return this.prisma.adminNotification.create({ data: createData })
  }

  async send(id: string, adminId: string) {
    await this.findById(id)
    return this.prisma.adminNotification.update({
      where: { id },
      data: { status: 'SENT', sentAt: new Date(), sentBy: adminId },
    })
  }

  // Templates
  async findTemplates() {
    return this.prisma.notificationTemplate.findMany({ orderBy: { name: 'asc' } })
  }

  async createTemplate(data: {
    name: string
    subject: string
    body: string
    channel?: NotificationChannel
  }) {
    const createData: Parameters<typeof this.prisma.notificationTemplate.create>[0]['data'] = {
      name: data.name,
      subject: data.subject,
      body: data.body,
      ...(data.channel !== undefined ? { channel: data.channel } : {}),
    }
    return this.prisma.notificationTemplate.create({ data: createData })
  }
}

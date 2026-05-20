import { PrismaService } from '@ecom/database'
import { type AdminNotificationStatus, type NotificationChannel, type Prisma } from '@ecom/database'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { withDefined } from '@ecom/shared/utils'
import { Injectable, NotFoundException } from '@nestjs/common'

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
    const createData: Parameters<typeof this.prisma.adminNotification.create>[0]['data'] = {
      title: data.title,
      message: data.message,
      ...withDefined({ channel: data.channel, targetAll: data.targetAll, sentBy: data.sentBy }),
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
      ...withDefined({ channel: data.channel }),
    }
    return this.prisma.notificationTemplate.create({ data: createData })
  }
}

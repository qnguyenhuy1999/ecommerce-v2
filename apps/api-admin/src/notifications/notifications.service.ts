import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, type AdminNotificationStatus, type NotificationChannel } from '@ecom/database';
import { buildPaginationMeta } from '@ecom/common';

@Injectable()
export class NotificationsService {
  async findAll(query: {
    page?: number;
    pageSize?: number;
    status?: AdminNotificationStatus;
  }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;

    const [items, total] = await Promise.all([
      prisma.adminNotification.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: pageSize }),
      prisma.adminNotification.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(page, pageSize, total) };
  }

  async findById(id: string) {
    const notification = await prisma.adminNotification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async create(data: {
    title: string; message: string; channel?: NotificationChannel;
    targetAll?: boolean; sentBy?: string;
  }) {
    return prisma.adminNotification.create({ data });
  }

  async send(id: string, adminId: string) {
    await this.findById(id);
    return prisma.adminNotification.update({
      where: { id },
      data: { status: 'SENT', sentAt: new Date(), sentBy: adminId },
    });
  }

  // Templates
  async findTemplates() {
    return prisma.notificationTemplate.findMany({ orderBy: { name: 'asc' } });
  }

  async createTemplate(data: {
    name: string; subject: string; body: string; channel?: NotificationChannel;
  }) {
    return prisma.notificationTemplate.create({ data });
  }
}

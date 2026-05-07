import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, type OrderStatus } from '@ecom/database';
import { buildPaginationMeta } from '@ecom/common';

@Injectable()
export class OrdersService {
  async findAll(query: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: OrderStatus;
    buyerId?: string;
  }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.buyerId) where.buyerId = query.buyerId;
    if (query.search) {
      where.OR = [
        { id: { contains: query.search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          sellerOrders: {
            include: {
              shop: { select: { id: true, name: true } },
              _count: { select: { items: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.order.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(page, pageSize, total) };
  }

  async findById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        sellerOrders: {
          include: {
            shop: { select: { id: true, name: true } },
            items: true,
            shipment: true,
            auditLogs: { orderBy: { createdAt: 'desc' } },
          },
        },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async forceCancel(id: string) {
    const order = await this.findById(id);
    return prisma.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' },
    });
  }

  async forceComplete(id: string) {
    const order = await this.findById(id);
    return prisma.order.update({
      where: { id: order.id },
      data: { status: 'DELIVERED' },
    });
  }

  async getStatusCounts() {
    const counts = await prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });
    const result: Record<string, number> = {};
    for (const item of counts) {
      result[item.status] = item._count.status;
    }
    return result;
  }
}

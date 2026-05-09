import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService, type OrderStatus, Prisma } from '@ecom/database';
import { offsetPaginate, buildOffsetResponse } from '@ecom/pagination';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: OrderStatus;
    buyerId?: string;
  }) {
    const where: Prisma.OrderWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.buyerId) where.buyerId = query.buyerId;
    if (query.search) {
      where.OR = [
        { id: query.search },
      ];
    }

    const { items, total } = await offsetPaginate(this.prisma.order, {
      page: query.page,
      pageSize: query.pageSize,
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
    });

    return buildOffsetResponse(items, query.page ?? 1, query.pageSize ?? 20, total);
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
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
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.sellerOrder.updateMany({
        where: { orderId: order.id },
        data: { status: 'CANCELLED' },
      });
      return tx.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' },
      });
    });
  }

  async forceComplete(id: string) {
    const order = await this.findById(id);
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.sellerOrder.updateMany({
        where: { orderId: order.id },
        data: { status: 'DELIVERED' },
      });
      return tx.order.update({
        where: { id: order.id },
        data: { status: 'DELIVERED' },
      });
    });
  }

  async getStatusCounts() {
    const counts = await this.prisma.order.groupBy({
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

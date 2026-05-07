import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, type SellerStatus } from '@ecom/database';
import { buildPaginationMeta } from '@ecom/common';

@Injectable()
export class SellersService {
  async findAll(query: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: SellerStatus;
  }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = { deletedAt: null };
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { shopName: { contains: query.search, mode: 'insensitive' } },
        {
          user: { email: { contains: query.search, mode: 'insensitive' } },
        },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.seller.findMany({
        where,
        include: {
          user: {
            select: { id: true, email: true, status: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.seller.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(page, pageSize, total) };
  }

  async findById(id: string) {
    const seller = await prisma.seller.findUnique({
      where: { id, deletedAt: null },
      include: {
        user: {
          select: { id: true, email: true, status: true, createdAt: true },
        },
        verifications: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    return seller;
  }

  async approve(id: string, adminId: string) {
    const seller = await this.findById(id);

    return prisma.seller.update({
      where: { id: seller.id },
      data: {
        status: 'ACTIVE',
        approvedAt: new Date(),
        approvedBy: adminId,
      },
    });
  }

  async reject(id: string, adminId: string, reason?: string) {
    const seller = await this.findById(id);

    return prisma.seller.update({
      where: { id: seller.id },
      data: {
        status: 'REJECTED',
        rejectedAt: new Date(),
        rejectedBy: adminId,
        rejectReason: reason,
      },
    });
  }

  async suspend(id: string, adminId: string, reason?: string) {
    const seller = await this.findById(id);

    return prisma.seller.update({
      where: { id: seller.id },
      data: {
        status: 'SUSPENDED',
        suspendedAt: new Date(),
        suspendedBy: adminId,
        suspendReason: reason,
      },
    });
  }

  async getStatusCounts() {
    const counts = await prisma.seller.groupBy({
      by: ['status'],
      _count: { status: true },
      where: { deletedAt: null },
    });

    const result: Record<string, number> = {};
    for (const item of counts) {
      result[item.status] = item._count.status;
    }
    return result;
  }
}

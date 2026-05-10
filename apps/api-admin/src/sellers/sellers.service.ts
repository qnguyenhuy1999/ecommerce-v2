import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService, type SellerStatus, Prisma } from '@ecom/database';
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma';

@Injectable()
export class SellersService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: SellerStatus;
  }) {
    const where: Prisma.SellerWhereInput = { deletedAt: null };
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { shopName: { contains: query.search, mode: 'insensitive' } },
        {
          user: { email: { contains: query.search, mode: 'insensitive' } },
        },
      ];
    }

    const { items, total } = await offsetPaginate(this.prisma.seller, {
      page: query.page,
      pageSize: query.pageSize,
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, status: true },
        },
      },
    });

    return buildOffsetResponse(items, query.page ?? 1, query.pageSize ?? 20, total);
  }

  async findById(id: string) {
    const seller = await this.prisma.seller.findUnique({
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

    if (seller.status === 'ACTIVE') {
      throw new BadRequestException('Seller is already active');
    }

    return this.prisma.seller.update({
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

    if (seller.status === 'REJECTED') {
      throw new BadRequestException('Seller is already rejected');
    }

    return this.prisma.seller.update({
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

    if (seller.status === 'SUSPENDED') {
      throw new BadRequestException('Seller is already suspended');
    }

    return this.prisma.seller.update({
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
    const counts = await this.prisma.seller.groupBy({
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

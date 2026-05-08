import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { prisma, type PlatformVoucherStatus, type PlatformVoucherType } from '@ecom/database';
import { offsetPaginate, buildOffsetResponse } from '@ecom/pagination';

@Injectable()
export class PromotionsService {
  async findAll(query: {
    page?: number;
    pageSize?: number;
    status?: PlatformVoucherStatus;
    search?: string;
  }) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { code: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const { items, total } = await offsetPaginate(prisma.platformVoucher, {
      page: query.page,
      pageSize: query.pageSize,
      where,
      orderBy: { createdAt: 'desc' },
    });

    return buildOffsetResponse(items, query.page ?? 1, query.pageSize ?? 20, total);
  }

  async findById(id: string) {
    const voucher = await prisma.platformVoucher.findUnique({ where: { id } });
    if (!voucher) throw new NotFoundException('Voucher not found');
    return voucher;
  }

  async create(data: {
    code: string; name: string; description?: string;
    type: PlatformVoucherType; discountValue: number;
    maxDiscountAmount?: number; minOrderAmount?: number;
    usageLimit?: number; usageLimitPerUser?: number;
    startsAt: Date; expiresAt: Date; createdBy?: string;
  }) {
    const existing = await prisma.platformVoucher.findUnique({ where: { code: data.code } });
    if (existing) throw new ConflictException('Voucher code already exists');

    if (data.type === 'PERCENTAGE' && data.discountValue > 100) {
      throw new BadRequestException('Percentage discount cannot exceed 100');
    }

    return prisma.platformVoucher.create({
      data: {
        ...data,
        discountValue: data.discountValue,
        maxDiscountAmount: data.maxDiscountAmount,
        minOrderAmount: data.minOrderAmount,
      },
    });
  }

  async update(id: string, data: Record<string, unknown>) {
    await this.findById(id);
    return prisma.platformVoucher.update({ where: { id }, data });
  }

  async getStatusCounts() {
    const counts = await prisma.platformVoucher.groupBy({
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService, type ReviewStatus, Prisma } from '@ecom/database';
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: {
    page?: number;
    pageSize?: number;
    status?: ReviewStatus;
  }) {
    const where: Prisma.ReviewWhereInput = {};
    if (query.status) where.status = query.status;

    const { items, total } = await offsetPaginate(this.prisma.review, {
      page: query.page,
      pageSize: query.pageSize,
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
        reports: true,
        _count: { select: { reports: true } },
      },
    });

    return buildOffsetResponse(items, query.page ?? 1, query.pageSize ?? 20, total);
  }

  async findById(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        images: true,
        replies: true,
        reports: true,
      },
    });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async approve(id: string) {
    await this.findById(id);
    return this.prisma.review.update({ where: { id }, data: { status: 'APPROVED' } });
  }

  async hide(id: string) {
    await this.findById(id);
    return this.prisma.review.update({ where: { id }, data: { status: 'HIDDEN' } });
  }

  async reject(id: string) {
    await this.findById(id);
    return this.prisma.review.update({ where: { id }, data: { status: 'REJECTED' } });
  }

  async getStatusCounts() {
    const counts = await this.prisma.review.groupBy({
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

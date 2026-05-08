import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, type ReviewStatus } from '@ecom/database';
import { buildPaginationMeta } from '@ecom/common';

@Injectable()
export class ReviewsService {
  async findAll(query: {
    page?: number;
    pageSize?: number;
    status?: ReviewStatus;
  }) {
    const page = query.page ?? 1;
    const pageSize = Math.min(query.pageSize ?? 20, 100);
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;

    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          images: true,
          reports: true,
          _count: { select: { reports: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.review.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(page, pageSize, total) };
  }

  async findById(id: string) {
    const review = await prisma.review.findUnique({
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
    return prisma.review.update({ where: { id }, data: { status: 'APPROVED' } });
  }

  async hide(id: string) {
    await this.findById(id);
    return prisma.review.update({ where: { id }, data: { status: 'HIDDEN' } });
  }

  async reject(id: string) {
    await this.findById(id);
    return prisma.review.update({ where: { id }, data: { status: 'REJECTED' } });
  }

  async getStatusCounts() {
    const counts = await prisma.review.groupBy({
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, type UserStatus } from '@ecom/database';
import { buildPaginationMeta } from '@ecom/common';

@Injectable()
export class UsersService {
  async findAll(query: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: UserStatus;
  }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, email: true, firstName: true, lastName: true,
          phone: true, emailVerified: true, status: true,
          createdAt: true, updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(page, pageSize, total) };
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, emailVerified: true, status: true,
        createdAt: true, updatedAt: true,
        sessions: {
          select: { id: true, userAgent: true, ipAddress: true, expiresAt: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async suspend(id: string) {
    await this.findById(id);
    return prisma.user.update({
      where: { id },
      data: { status: 'SUSPENDED' },
    });
  }

  async ban(id: string) {
    await this.findById(id);
    return prisma.user.update({
      where: { id },
      data: { status: 'BANNED' },
    });
  }

  async activate(id: string) {
    await this.findById(id);
    return prisma.user.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  async getStatusCounts() {
    const counts = await prisma.user.groupBy({
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

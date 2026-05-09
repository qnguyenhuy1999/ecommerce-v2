import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService, type UserStatus, Prisma } from '@ecom/database';
import { offsetPaginate, buildOffsetResponse } from '@ecom/pagination';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: UserStatus;
  }) {
    const where: Prisma.UserWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const { items, total } = await offsetPaginate(this.prisma.user, {
      page: query.page,
      pageSize: query.pageSize,
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, emailVerified: true, status: true,
        createdAt: true, updatedAt: true,
      },
    });

    return buildOffsetResponse(items, query.page ?? 1, query.pageSize ?? 20, total);
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
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
    return this.prisma.user.update({
      where: { id },
      data: { status: 'SUSPENDED' },
    });
  }

  async ban(id: string) {
    await this.findById(id);
    return this.prisma.user.update({
      where: { id },
      data: { status: 'BANNED' },
    });
  }

  async activate(id: string) {
    await this.findById(id);
    return this.prisma.user.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  async getStatusCounts() {
    const counts = await this.prisma.user.groupBy({
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

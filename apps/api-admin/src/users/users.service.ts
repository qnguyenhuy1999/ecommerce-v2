import { Injectable, NotFoundException } from '@nestjs/common'
import type { PrismaService, Prisma } from '@ecom/database'
import { type UserStatus, UserStatus as US } from '@ecom/contracts/enums'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'
import { withDefined } from '@ecom/shared/utils'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: { page?: number; limit?: number; search?: string; status?: UserStatus }) {
    const where: Prisma.UserWhereInput = {}
    if (query.status) where.status = query.status
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    const { items, total } = await offsetPaginate(this.prisma.user, {
      ...withDefined({ page: query.page, limit: query.limit }),
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        emailVerified: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return buildOffsetResponse(items, query.page ?? 1, query.limit ?? 20, total)
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        emailVerified: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        sessions: {
          select: { id: true, userAgent: true, ipAddress: true, expiresAt: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async suspend(id: string) {
    await this.findById(id)
    return this.prisma.user.update({
      where: { id },
      data: { status: US.SUSPENDED },
    })
  }

  async ban(id: string) {
    await this.findById(id)
    return this.prisma.user.update({
      where: { id },
      data: { status: US.BANNED },
    })
  }

  async activate(id: string) {
    await this.findById(id)
    return this.prisma.user.update({
      where: { id },
      data: { status: US.ACTIVE },
    })
  }

  async getStatusCounts() {
    const counts = await this.prisma.user.groupBy({
      by: ['status'],
      _count: { status: true },
    })
    const result: Record<string, number> = {}
    for (const item of counts) {
      result[item.status] = item._count.status
    }
    return result
  }
}

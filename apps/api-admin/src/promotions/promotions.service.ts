import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import type { PrismaService, Prisma } from '@ecom/database'
import { type PlatformVoucherStatus, type PlatformVoucherType } from '@ecom/database'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: {
    page?: number
    limit?: number
    status?: PlatformVoucherStatus
    search?: string
  }) {
    const where: Prisma.PlatformVoucherWhereInput = {}
    if (query.status) where.status = query.status
    if (query.search) {
      where.OR = [
        { code: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    const { items, total } = await offsetPaginate(this.prisma.platformVoucher, {
      page: query.page,
      limit: query.limit,
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, query.page ?? 1, query.limit ?? 20, total)
  }

  async findById(id: string) {
    const voucher = await this.prisma.platformVoucher.findUnique({ where: { id } })
    if (!voucher) throw new NotFoundException('Voucher not found')
    return voucher
  }

  async create(data: {
    code: string
    name: string
    description?: string
    type: PlatformVoucherType
    discountValue: number
    maxDiscountAmount?: number
    minOrderAmount?: number
    usageLimit?: number
    usageLimitPerUser?: number
    startsAt: Date
    expiresAt: Date
    createdBy?: string
  }) {
    const existing = await this.prisma.platformVoucher.findUnique({ where: { code: data.code } })
    if (existing) throw new ConflictException('Voucher code already exists')

    if (data.type === 'PERCENTAGE' && data.discountValue > 100) {
      throw new BadRequestException('Percentage discount cannot exceed 100')
    }

    return this.prisma.platformVoucher.create({
      data: {
        ...data,
        discountValue: data.discountValue,
        maxDiscountAmount: data.maxDiscountAmount,
        minOrderAmount: data.minOrderAmount,
      },
    })
  }

  async update(id: string, data: Prisma.PlatformVoucherUpdateInput) {
    await this.findById(id)
    return this.prisma.platformVoucher.update({ where: { id }, data })
  }

  async getStatusCounts() {
    const counts = await this.prisma.platformVoucher.groupBy({
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

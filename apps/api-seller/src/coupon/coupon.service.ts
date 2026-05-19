import type { PrismaService } from '@ecom/database'
import { type Prisma, CouponScope, CouponStatus, CouponType } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { withDefined } from '@ecom/shared/utils'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import type { CouponQueryDto } from './dto/coupon-query.dto'
import type { CreateCouponDto } from './dto/create-coupon.dto'
import type { UpdateCouponDto } from './dto/update-coupon.dto'

@Injectable()
export class CouponService {
  constructor(private readonly prisma: PrismaService) {}
  async list(shopId: string, query: CouponQueryDto) {
    const {
      page = 1,
      limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      status,
      type,
    } = query

    const finalSort = sortBy
    const finalOrder = sortOrder

    const where: Prisma.CouponWhereInput = { shopId }
    if (status) where.status = status
    if (type) where.type = type
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }

    const { items, total } = await offsetPaginate(this.prisma.coupon, {
      page,
      limit,
      where,
      include: {
        _count: { select: { couponUsages: true } },
      },
      orderBy: { [finalSort]: finalOrder },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async getById(shopId: string, couponId: string) {
    const coupon = await this.prisma.coupon.findFirst({
      where: { id: couponId, shopId },
      include: {
        couponProducts: true,
        couponCategories: true,
        _count: { select: { couponUsages: true } },
      },
    })

    if (!coupon) {
      throw new NotFoundException('Coupon not found')
    }

    return coupon
  }

  async create(shopId: string, dto: CreateCouponDto) {
    if (dto.type === CouponType.PERCENTAGE && dto.discountValue > 100) {
      throw new BadRequestException('Percentage discount cannot exceed 100')
    }

    if (new Date(dto.expiresAt) <= new Date(dto.startsAt)) {
      throw new BadRequestException('Expiry date must be after start date')
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const coupon = await tx.coupon.create({
        data: {
          shopId,
          code: dto.code.toUpperCase(),
          name: dto.name,
          ...withDefined({ description: dto.description }),
          type: dto.type,
          scope: dto.scope ?? 'ALL_PRODUCTS',
          discountValue: dto.discountValue,
          ...withDefined({ maxDiscountAmount: dto.maxDiscountAmount }),
          ...withDefined({ minOrderAmount: dto.minOrderAmount }),
          ...withDefined({ usageLimit: dto.usageLimit }),
          ...withDefined({ usageLimitPerUser: dto.usageLimitPerUser }),
          autoApply: dto.autoApply ?? false,
          startsAt: new Date(dto.startsAt),
          expiresAt: new Date(dto.expiresAt),
        },
      })

      if (dto.scope === CouponScope.SPECIFIC_PRODUCTS && dto.productIds?.length) {
        await tx.couponProduct.createMany({
          data: dto.productIds.map((productId) => ({
            couponId: coupon.id,
            productId,
          })),
        })
      }

      if (dto.scope === CouponScope.SPECIFIC_CATEGORIES && dto.categoryIds?.length) {
        await tx.couponCategory.createMany({
          data: dto.categoryIds.map((categoryId) => ({
            couponId: coupon.id,
            categoryId,
          })),
        })
      }

      return this.getById(shopId, coupon.id)
    })
  }

  async update(shopId: string, couponId: string, dto: UpdateCouponDto) {
    const existing = await this.prisma.coupon.findFirst({
      where: { id: couponId, shopId },
    })

    if (!existing) {
      throw new NotFoundException('Coupon not found')
    }

    if (
      dto.type === CouponType.PERCENTAGE &&
      dto.discountValue !== undefined &&
      dto.discountValue > 100
    ) {
      throw new BadRequestException('Percentage discount cannot exceed 100')
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const data: Prisma.CouponUpdateInput = {}
      if (dto.name !== undefined) data.name = dto.name
      if (dto.description !== undefined) data.description = dto.description
      if (dto.type !== undefined) data.type = dto.type
      if (dto.scope !== undefined) data.scope = dto.scope
      if (dto.status !== undefined) data.status = dto.status
      if (dto.discountValue !== undefined) data.discountValue = dto.discountValue
      if (dto.maxDiscountAmount !== undefined) data.maxDiscountAmount = dto.maxDiscountAmount
      if (dto.minOrderAmount !== undefined) data.minOrderAmount = dto.minOrderAmount
      if (dto.usageLimit !== undefined) data.usageLimit = dto.usageLimit
      if (dto.usageLimitPerUser !== undefined) data.usageLimitPerUser = dto.usageLimitPerUser
      if (dto.autoApply !== undefined) data.autoApply = dto.autoApply
      if (dto.startsAt !== undefined) data.startsAt = new Date(dto.startsAt)
      if (dto.expiresAt !== undefined) data.expiresAt = new Date(dto.expiresAt)

      await tx.coupon.update({ where: { id: couponId }, data })

      if (dto.productIds !== undefined) {
        await tx.couponProduct.deleteMany({ where: { couponId } })
        if (dto.productIds.length) {
          await tx.couponProduct.createMany({
            data: dto.productIds.map((productId) => ({ couponId, productId })),
          })
        }
      }

      if (dto.categoryIds !== undefined) {
        await tx.couponCategory.deleteMany({ where: { couponId } })
        if (dto.categoryIds.length) {
          await tx.couponCategory.createMany({
            data: dto.categoryIds.map((categoryId) => ({ couponId, categoryId })),
          })
        }
      }

      return this.getById(shopId, couponId)
    })
  }

  async delete(shopId: string, couponId: string) {
    const existing = await this.prisma.coupon.findFirst({
      where: { id: couponId, shopId },
    })

    if (!existing) {
      throw new NotFoundException('Coupon not found')
    }

    if (existing.usedCount > 0) {
      throw new BadRequestException('Cannot delete a coupon that has been used. Pause it instead.')
    }

    await this.prisma.coupon.delete({ where: { id: couponId } })
  }

  async getStats(shopId: string) {
    const now = new Date()
    const [total, active, totalUsages] = await Promise.all([
      this.prisma.coupon.count({ where: { shopId } }),
      this.prisma.coupon.count({
        where: {
          shopId,
          status: CouponStatus.ACTIVE,
          startsAt: { lte: now },
          expiresAt: { gte: now },
        },
      }),
      this.prisma.couponUsage.count({
        where: { coupon: { shopId } },
      }),
    ])

    return { total, active, totalUsages }
  }
}

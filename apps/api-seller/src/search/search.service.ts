import { Injectable, NotFoundException } from '@nestjs/common'
import type { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import type { ProductSearchDto, OrderSearchDto } from './dto/search-query.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}
  async searchProducts(shopId: string, query: ProductSearchDto) {
    const {
      page = 1,
      pageSize = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      q,
      sku,
      status,
      categoryId,
      minPrice,
      maxPrice,
      minStock,
      maxStock,
      sort,
      order,
    } = query

    const finalSort = sort || sortBy
    const finalOrder = order || sortOrder

    const where: Prisma.ProductWhereInput = {
      shopId,
      deletedAt: null,
    }
    if (status) where.status = status as NonNullable<Prisma.ProductWhereInput['status']>
    if (categoryId) where.categoryId = categoryId
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
      ]
    }
    if (sku) where.variants = { some: { sku: { contains: sku, mode: 'insensitive' } } }
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: { gte?: number; lte?: number } = {}
      if (minPrice !== undefined) priceFilter.gte = minPrice
      if (maxPrice !== undefined) priceFilter.lte = maxPrice
      where.variants = { some: { price: priceFilter } }
    }
    if (minStock !== undefined || maxStock !== undefined) {
      const stockFilter: { gte?: number; lte?: number } = {}
      if (minStock !== undefined) stockFilter.gte = minStock
      if (maxStock !== undefined) stockFilter.lte = maxStock
      where.variants = { some: { stock: stockFilter } }
    }

    const { items, total } = await offsetPaginate(this.prisma.product, {
      page,
      pageSize,
      where,
      include: {
        variants: { select: { id: true, sku: true, price: true, stock: true } },
        images: { take: 1, orderBy: { sortOrder: 'asc' } },
        category: { select: { id: true, name: true } },
      },
      orderBy: { [finalSort]: finalOrder },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async searchOrders(shopId: string, query: OrderSearchDto) {
    const {
      page = 1,
      pageSize = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      q,
      status,
      startDate,
      endDate,
      sort,
      order,
    } = query

    const finalSort = sort || sortBy
    const finalOrder = order || sortOrder

    const where: Prisma.SellerOrderWhereInput = { shopId }
    if (status) where.status = status as NonNullable<Prisma.SellerOrderWhereInput['status']>
    if (startDate || endDate) {
      const createdAt: { gte?: Date; lte?: Date } = {}
      if (startDate) createdAt.gte = new Date(startDate)
      if (endDate) createdAt.lte = new Date(endDate)
      where.createdAt = createdAt
    }
    if (q) where.items = { some: { productName: { contains: q, mode: 'insensitive' } } }

    const { items, total } = await offsetPaginate(this.prisma.sellerOrder, {
      page,
      pageSize,
      where,
      include: {
        items: { select: { id: true, productName: true, quantity: true, totalPrice: true } },
      },
      orderBy: { [finalSort]: finalOrder },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async listSavedFilters(shopId: string, _userId: string, entity?: string) {
    return this.prisma.savedFilter.findMany({
      where: {
        shopId,
        ...(entity ? { entity } : {}),
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async saveFilter(
    shopId: string,
    _userId: string,
    name: string,
    entity: string,
    filters: Record<string, unknown>,
  ) {
    return this.prisma.savedFilter.create({
      data: { shopId, name, entity, filters: filters as Prisma.InputJsonValue },
    })
  }

  async deleteFilter(shopId: string, _userId: string, filterId: string) {
    const filter = await this.prisma.savedFilter.findFirst({
      where: { id: filterId, shopId },
    })

    if (!filter) {
      throw new NotFoundException('Saved filter not found')
    }

    await this.prisma.savedFilter.delete({ where: { id: filterId } })
  }
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService, Prisma } from '@ecom/database'
import { ProductSearchDto, OrderSearchDto } from './dto/search-query.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}
  async searchProducts(shopId: string, query: ProductSearchDto) {
    const {
      page = 1,
      pageSize = 20,
      q,
      sku,
      status,
      categoryId,
      minPrice,
      maxPrice,
      minStock,
      maxStock,
      sort = 'createdAt',
      order = 'desc',
    } = query

    const where: Prisma.ProductWhereInput = {
      shopId,
      deletedAt: null,
      ...(status ? { status: status as Prisma.ProductWhereInput['status'] } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { slug: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(sku
        ? {
            variants: {
              some: { sku: { contains: sku, mode: 'insensitive' } },
            },
          }
        : {}),
      ...(minPrice || maxPrice
        ? {
            variants: {
              some: {
                price: {
                  ...(minPrice ? { gte: minPrice } : {}),
                  ...(maxPrice ? { lte: maxPrice } : {}),
                },
              },
            },
          }
        : {}),
      ...(minStock !== undefined || maxStock !== undefined
        ? {
            variants: {
              some: {
                stock: {
                  ...(minStock !== undefined ? { gte: minStock } : {}),
                  ...(maxStock !== undefined ? { lte: maxStock } : {}),
                },
              },
            },
          }
        : {}),
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
      orderBy: { [sort]: order },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async searchOrders(shopId: string, query: OrderSearchDto) {
    const { page = 1, pageSize = 20, q, status, startDate, endDate, sort = 'createdAt', order = 'desc' } = query

    const where: Prisma.SellerOrderWhereInput = {
      shopId,
      ...(status ? { status: status as Prisma.SellerOrderWhereInput['status'] } : {}),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate ? { gte: new Date(startDate) } : {}),
              ...(endDate ? { lte: new Date(endDate) } : {}),
            },
          }
        : {}),
      ...(q
        ? {
            items: { some: { productName: { contains: q, mode: 'insensitive' } } },
          }
        : {}),
    }

    const { items, total } = await offsetPaginate(this.prisma.sellerOrder, {
      page,
      pageSize,
      where,
      include: {
        items: { select: { id: true, productName: true, quantity: true, totalPrice: true } },
      },
      orderBy: { [sort]: order },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async listSavedFilters(shopId: string, userId: string, entity?: string) {
    return this.prisma.savedFilter.findMany({
      where: {
        shopId,
        userId,
        ...(entity ? { entity } : {}),
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async saveFilter(shopId: string, userId: string, name: string, entity: string, filters: Record<string, unknown>) {
    return this.prisma.savedFilter.create({
      data: { shopId, userId, name, entity, filters: filters as Prisma.InputJsonValue },
    })
  }

  async deleteFilter(shopId: string, userId: string, filterId: string) {
    const filter = await this.prisma.savedFilter.findFirst({
      where: { id: filterId, shopId, userId },
    })

    if (!filter) {
      throw new NotFoundException('Saved filter not found')
    }

    await this.prisma.savedFilter.delete({ where: { id: filterId } })
  }
}

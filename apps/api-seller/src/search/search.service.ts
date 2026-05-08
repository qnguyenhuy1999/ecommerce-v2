import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma, Prisma } from '@ecom/database'
import { ProductSearchDto, OrderSearchDto } from './dto/search-query.dto'
import { buildPaginationMeta } from '../common/dto/pagination.dto'

@Injectable()
export class SearchService {
  async searchProducts(shopId: string, query: ProductSearchDto) {
    const {
      page = 1,
      limit = 20,
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

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          variants: { select: { id: true, sku: true, price: true, stock: true } },
          images: { take: 1, orderBy: { sortOrder: 'asc' } },
          category: { select: { id: true, name: true } },
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return { data: products, meta: buildPaginationMeta(page, limit, total) }
  }

  async searchOrders(shopId: string, query: OrderSearchDto) {
    const { page = 1, limit = 20, q, status, startDate, endDate, sort = 'createdAt', order = 'desc' } = query

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

    const [orders, total] = await Promise.all([
      prisma.sellerOrder.findMany({
        where,
        include: {
          items: { select: { id: true, productName: true, quantity: true, totalPrice: true } },
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.sellerOrder.count({ where }),
    ])

    return { data: orders, meta: buildPaginationMeta(page, limit, total) }
  }

  async listSavedFilters(shopId: string, userId: string, entity?: string) {
    return prisma.savedFilter.findMany({
      where: {
        shopId,
        userId,
        ...(entity ? { entity } : {}),
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async saveFilter(shopId: string, userId: string, name: string, entity: string, filters: Record<string, unknown>) {
    return prisma.savedFilter.create({
      data: { shopId, userId, name, entity, filters: filters as Prisma.InputJsonValue },
    })
  }

  async deleteFilter(shopId: string, userId: string, filterId: string) {
    const filter = await prisma.savedFilter.findFirst({
      where: { id: filterId, shopId, userId },
    })

    if (!filter) {
      throw new NotFoundException('Saved filter not found')
    }

    await prisma.savedFilter.delete({ where: { id: filterId } })
  }
}

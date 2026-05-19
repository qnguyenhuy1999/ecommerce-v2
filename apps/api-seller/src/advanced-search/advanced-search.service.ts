import { ProductStatus } from '@ecom/contracts/enums'
import type { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { Injectable } from '@nestjs/common'
import type { SearchProductsDto, SearchSuggestionsDto } from './dto/search.dto'

@Injectable()
export class AdvancedSearchService {
  constructor(private readonly prisma: PrismaService) {}
  async searchProducts(dto: SearchProductsDto) {
    const {
      query,
      categoryId,
      minPrice,
      maxPrice,
      sortBy = 'relevance',
      sortOrder = 'desc',
      page = 1,
      limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT,
    } = dto

    const where: Prisma.ProductWhereInput = {
      status: ProductStatus.PUBLISHED,
      deletedAt: null,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
      ...(categoryId && { categoryId }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            basePrice: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {}),
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sortBy === 'price' ? { basePrice: sortOrder as Prisma.SortOrder } : { createdAt: 'desc' }

    const { items, total } = await offsetPaginate(this.prisma.product, {
      page,
      limit: limit,
      where,
      orderBy,
      include: {
        shop: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
    })

    // SearchQuery model not in schema — skip logging

    return buildOffsetResponse(items, page, limit, total)
  }

  async getSuggestions(dto: SearchSuggestionsDto) {
    const { query, limit = 10 } = dto

    const products = await this.prisma.product.findMany({
      where: {
        status: ProductStatus.PUBLISHED,
        deletedAt: null,
        name: { contains: query, mode: 'insensitive' },
      },
      select: { name: true },
      take: limit,
      distinct: ['name'],
    })

    const categories = await this.prisma.category.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      select: { id: true, name: true },
      take: 5,
    })

    return {
      products: products.map((p: { name: string }) => p.name),
      categories,
    }
  }

  getPopularSearches(_limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT) {
    // SearchQuery model not in schema — return empty
    return []
  }

  async getSearchAnalytics(shopId: string) {
    const products = await this.prisma.product.findMany({
      where: { shopId, status: ProductStatus.PUBLISHED, deletedAt: null },
      select: { id: true, name: true },
    })

    return {
      totalProducts: products.length,
      indexedProducts: products.length,
    }
  }
}

import { Injectable } from '@nestjs/common'
import { prisma, Prisma } from '@ecom/database'
import { SearchProductsDto, SearchSuggestionsDto } from './dto/search.dto'
import { buildPaginationMeta } from '../common/dto/pagination.dto'

@Injectable()
export class AdvancedSearchService {
  async searchProducts(dto: SearchProductsDto) {
    const {
      query,
      categoryId,
      minPrice,
      maxPrice,
      sortBy = 'relevance',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = dto

    const where: Prisma.ProductWhereInput = {
      status: 'PUBLISHED',
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
      sortBy === 'price'
        ? { basePrice: sortOrder as Prisma.SortOrder }
        : sortBy === 'newest'
          ? { createdAt: 'desc' }
          : sortBy === 'sold'
            ? { createdAt: 'desc' }
            : { createdAt: 'desc' }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          shop: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
        },
      }),
      prisma.product.count({ where }),
    ])

    await this.logSearchQuery(query, total)

    return { data: products, meta: buildPaginationMeta(page, limit, total) }
  }

  async getSuggestions(dto: SearchSuggestionsDto) {
    const { query, limit = 10 } = dto

    const products = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        name: { contains: query, mode: 'insensitive' },
      },
      select: { name: true },
      take: limit,
      distinct: ['name'],
    })

    const categories = await prisma.category.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      select: { id: true, name: true },
      take: 5,
    })

    return {
      products: products.map((p: { name: string }) => p.name),
      categories,
    }
  }

  async getPopularSearches(limit = 20) {
    const searches = await prisma.searchQuery.findMany({
      orderBy: { count: 'desc' },
      take: limit,
      select: { query: true, count: true, resultsCount: true },
    })

    return searches
  }

  async getSearchAnalytics(shopId: string) {
    const products = await prisma.product.findMany({
      where: { shopId, status: 'PUBLISHED', deletedAt: null },
      select: { id: true, name: true },
    })

    return {
      totalProducts: products.length,
      indexedProducts: products.length,
    }
  }

  private async logSearchQuery(query: string, resultsCount: number) {
    const normalized = query.toLowerCase().trim()

    await prisma.searchQuery.upsert({
      where: { query: normalized },
      update: {
        count: { increment: 1 },
        resultsCount,
        lastSearchedAt: new Date(),
      },
      create: {
        query: normalized,
        count: 1,
        resultsCount,
        lastSearchedAt: new Date(),
      },
    })
  }
}

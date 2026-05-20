import { Injectable } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { ProductStatus } from '@ecom/contracts'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'

@Injectable()
export class RecommendationService {
  constructor(private readonly prisma: PrismaService) {}
  async trackEvent(
    userId: string | undefined,
    sessionId: string,
    eventType: string,
    data: {
      productId?: string
      categoryId?: string
      searchQuery?: string
      metadata?: Record<string, unknown>
    },
  ) {
    const normalizedEventType = this.normalizeEventType(eventType)

    return this.prisma.userEvent.create({
      data: {
        userId: userId ?? null,
        sessionId,
        event: normalizedEventType,
        entityType: 'PRODUCT',
        entityId: data.productId ?? '',
        metadata: (data.metadata ?? {}) as Prisma.InputJsonValue,
      },
    })
  }

  async getSimilarProducts(productId: string, limit = 10) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    })

    if (!product) return []

    return this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
        status: ProductStatus.PUBLISHED,
        deletedAt: null,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
  }

  async getTrendingProducts(limit = PAGINATION_DEFAULTS.PAGE_SIZE) {
    return this.prisma.product.findMany({
      where: { status: ProductStatus.PUBLISHED, deletedAt: null },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
  }

  async getPersonalizedRecommendations(userId: string, limit = PAGINATION_DEFAULTS.PAGE_SIZE) {
    const recentEvents = await this.prisma.userEvent.findMany({
      where: { userId, entityType: 'PRODUCT' },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { entityId: true },
    })

    const productIds = [
      ...new Set(recentEvents.map((e: { entityId: string }) => e.entityId)),
    ] as string[]

    if (productIds.length === 0) {
      return this.getTrendingProducts(limit)
    }

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { categoryId: true },
    })

    const categoryIds = [
      ...new Set(products.map((p: { categoryId: string | null }) => p.categoryId).filter(Boolean)),
    ] as string[]

    return this.prisma.product.findMany({
      where: {
        categoryId: { in: categoryIds },
        status: ProductStatus.PUBLISHED,
        deletedAt: null,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
  }

  async getRecentlyViewed(userId: string, limit = PAGINATION_DEFAULTS.PAGE_SIZE) {
    const events = await this.prisma.userEvent.findMany({
      where: { userId, event: 'VIEW', entityType: 'PRODUCT' },
      orderBy: { createdAt: 'desc' },
      take: limit,
      distinct: ['entityId'],
      select: { entityId: true },
    })

    const productIds = events.map((e: { entityId: string }) => e.entityId)
    if (productIds.length === 0) return []

    return this.prisma.product.findMany({
      where: { id: { in: productIds }, status: ProductStatus.PUBLISHED, deletedAt: null },
    })
  }

  async getSellerRecommendationStats(shopId: string) {
    const products = await this.prisma.product.findMany({
      where: { shopId, status: ProductStatus.PUBLISHED, deletedAt: null },
      select: { id: true },
    })

    const productIds = products.map((p: { id: string }) => p.id)

    const [views, clicks] = await Promise.all([
      this.prisma.userEvent.count({
        where: {
          entityId: { in: productIds },
          event: 'VIEW',
          entityType: 'PRODUCT',
        },
      }),
      this.prisma.userEvent.count({
        where: {
          entityId: { in: productIds },
          event: 'CLICK',
          entityType: 'PRODUCT',
        },
      }),
    ])

    return { totalViews: views, totalClicks: clicks, productCount: productIds.length }
  }

  private normalizeEventType(eventType: string) {
    switch (eventType) {
      case 'PRODUCT_VIEW':
        return 'VIEW' as const
      case 'PRODUCT_CLICK':
        return 'CLICK' as const
      default:
        return eventType as
          | 'VIEW'
          | 'CLICK'
          | 'ADD_TO_CART'
          | 'PURCHASE'
          | 'SEARCH'
          | 'WISHLIST'
          | 'SHARE'
          | 'REVIEW'
    }
  }
}

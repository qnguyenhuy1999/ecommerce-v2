import { Injectable } from '@nestjs/common'
import { prisma } from '@ecom/database'
import { ProductStatus, UserEventType, PAGINATION_DEFAULTS } from '@ecom/constants'

@Injectable()
export class RecommendationService {
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
    return prisma.userEvent.create({
      data: {
        userId,
        sessionId,
        event: eventType,
        entityType: 'PRODUCT',
        entityId: data.productId ?? '',
        metadata: data.metadata ?? {},
      },
    })
  }

  async getSimilarProducts(productId: string, limit = 10) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    })

    if (!product) return []

    return prisma.product.findMany({
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
    return prisma.product.findMany({
      where: { status: ProductStatus.PUBLISHED, deletedAt: null },
      take: limit,
      orderBy: { soldCount: 'desc' },
    })
  }

  async getPersonalizedRecommendations(userId: string, limit = PAGINATION_DEFAULTS.PAGE_SIZE) {
    const recentEvents = await prisma.userEvent.findMany({
      where: { userId, entityType: 'PRODUCT' },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { entityId: true },
    })

    const productIds = [...new Set(recentEvents.map((e: { entityId: string }) => e.entityId))] as string[]

    if (productIds.length === 0) {
      return this.getTrendingProducts(limit)
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { categoryId: true },
    })

    const categoryIds = [...new Set(products.map((p: { categoryId: string | null }) => p.categoryId).filter(Boolean))] as string[]

    return prisma.product.findMany({
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
    const events = await prisma.userEvent.findMany({
      where: { userId, event: UserEventType.PRODUCT_VIEW, entityType: 'PRODUCT' },
      orderBy: { createdAt: 'desc' },
      take: limit,
      distinct: ['entityId'],
      select: { entityId: true },
    })

    const productIds = events.map((e: { entityId: string }) => e.entityId)
    if (productIds.length === 0) return []

    return prisma.product.findMany({
      where: { id: { in: productIds }, status: ProductStatus.PUBLISHED, deletedAt: null },
    })
  }

  async getSellerRecommendationStats(shopId: string) {
    const products = await prisma.product.findMany({
      where: { shopId, status: ProductStatus.PUBLISHED, deletedAt: null },
      select: { id: true },
    })

    const productIds = products.map((p: { id: string }) => p.id)

    const [views, clicks] = await Promise.all([
      prisma.userEvent.count({
        where: { entityId: { in: productIds }, event: UserEventType.PRODUCT_VIEW, entityType: 'PRODUCT' },
      }),
      prisma.userEvent.count({
        where: { entityId: { in: productIds }, event: UserEventType.PRODUCT_CLICK, entityType: 'PRODUCT' },
      }),
    ])

    return { totalViews: views, totalClicks: clicks, productCount: productIds.length }
  }
}

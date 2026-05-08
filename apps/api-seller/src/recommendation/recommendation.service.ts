import { Injectable } from '@nestjs/common'
import { prisma } from '@ecom/database'

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
        status: 'PUBLISHED',
        deletedAt: null,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
  }

  async getTrendingProducts(limit = 20) {
    return prisma.product.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      take: limit,
      orderBy: { soldCount: 'desc' },
    })
  }

  async getPersonalizedRecommendations(userId: string, limit = 20) {
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
        status: 'PUBLISHED',
        deletedAt: null,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
  }

  async getRecentlyViewed(userId: string, limit = 20) {
    const events = await prisma.userEvent.findMany({
      where: { userId, event: 'product_view', entityType: 'PRODUCT' },
      orderBy: { createdAt: 'desc' },
      take: limit,
      distinct: ['entityId'],
      select: { entityId: true },
    })

    const productIds = events.map((e: { entityId: string }) => e.entityId)
    if (productIds.length === 0) return []

    return prisma.product.findMany({
      where: { id: { in: productIds }, status: 'PUBLISHED', deletedAt: null },
    })
  }

  async getSellerRecommendationStats(shopId: string) {
    const products = await prisma.product.findMany({
      where: { shopId, status: 'PUBLISHED', deletedAt: null },
      select: { id: true },
    })

    const productIds = products.map((p: { id: string }) => p.id)

    const [views, clicks] = await Promise.all([
      prisma.userEvent.count({
        where: { entityId: { in: productIds }, event: 'product_view', entityType: 'PRODUCT' },
      }),
      prisma.userEvent.count({
        where: { entityId: { in: productIds }, event: 'product_click', entityType: 'PRODUCT' },
      }),
    ])

    return { totalViews: views, totalClicks: clicks, productCount: productIds.length }
  }
}

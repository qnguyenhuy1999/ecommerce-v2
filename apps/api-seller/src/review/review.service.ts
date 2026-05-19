import { ReviewStatus } from '@ecom/contracts/enums'
import type { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { Injectable, NotFoundException } from '@nestjs/common'
import type { ReviewQueryDto } from './dto/review-query.dto'

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}
  async list(shopId: string, query: ReviewQueryDto) {
    const {
      page = 1,
      limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      productId,
      rating,
      status,
      replyFilter,
    } = query

    const finalSort = sortBy
    const finalOrder = sortOrder

    const shopProducts = this.prisma.product.findMany({
      where: { shopId, deletedAt: null },
      select: { id: true },
    })
    const productIds = (await shopProducts).map((p: { id: string }) => p.id)

    const where: Prisma.ReviewWhereInput = {
      productId: { in: productIds },
    }
    if (productId) where.productId = productId
    if (rating) where.rating = rating
    if (status !== undefined) where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { comment: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (replyFilter === 'hasReply') where.replies = { some: {} }
    if (replyFilter === 'noReply') where.replies = { none: {} }

    const { items, total } = await offsetPaginate(this.prisma.review, {
      page,
      limit,
      where,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        replies: { orderBy: { createdAt: 'asc' } },
        _count: { select: { reports: true } },
      },
      orderBy: { [finalSort]: finalOrder },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async getById(shopId: string, reviewId: string) {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, productId: { in: await this.getShopProductIds(shopId) } },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        replies: { orderBy: { createdAt: 'asc' } },
        reports: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!review) {
      throw new NotFoundException('Review not found')
    }

    return review
  }

  async reply(shopId: string, reviewId: string, message: string) {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, productId: { in: await this.getShopProductIds(shopId) } },
    })

    if (!review) {
      throw new NotFoundException('Review not found')
    }

    return this.prisma.reviewReply.create({
      data: { reviewId, shopId, message },
    })
  }

  async report(shopId: string, reviewId: string, reason: string, details?: string) {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, productId: { in: await this.getShopProductIds(shopId) } },
    })

    if (!review) {
      throw new NotFoundException('Review not found')
    }

    const reportData: Prisma.ReviewReportUncheckedCreateInput = {
      reviewId,
      shopId,
      reason,
    }

    if (details !== undefined) {
      reportData.details = details
    }

    return this.prisma.reviewReport.create({ data: reportData })
  }

  async getAnalytics(shopId: string) {
    const productIds = await this.getShopProductIds(shopId)

    const [totalReviews, ratingDist, avgRating] = await Promise.all([
      this.prisma.review.count({
        where: { productId: { in: productIds }, status: ReviewStatus.APPROVED },
      }),
      this.prisma.review.groupBy({
        by: ['rating'],
        where: { productId: { in: productIds }, status: ReviewStatus.APPROVED },
        _count: true,
      }),
      this.prisma.review.aggregate({
        where: { productId: { in: productIds }, status: ReviewStatus.APPROVED },
        _avg: { rating: true },
      }),
    ])

    return {
      totalReviews,
      averageRating: avgRating._avg.rating ?? 0,
      ratingDistribution: ratingDist.map((r: { rating: number; _count: number }) => ({
        rating: r.rating,
        count: r._count,
      })),
    }
  }

  private async getShopProductIds(shopId: string): Promise<string[]> {
    const products = await this.prisma.product.findMany({
      where: { shopId, deletedAt: null },
      select: { id: true },
    })
    return products.map((p: { id: string }) => p.id)
  }
}

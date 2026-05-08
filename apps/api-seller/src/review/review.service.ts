import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma, Prisma } from '@ecom/database'
import { ReviewQueryDto } from './dto/review-query.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/pagination'

@Injectable()
export class ReviewService {
  async list(shopId: string, query: ReviewQueryDto) {
    const { page = 1, pageSize = 20, sort = 'createdAt', order = 'desc', search, productId, rating, status, replyFilter } = query

    const shopProducts = prisma.product.findMany({
      where: { shopId, deletedAt: null },
      select: { id: true },
    })
    const productIds = (await shopProducts).map((p: { id: string }) => p.id)

    const where: Prisma.ReviewWhereInput = {
      productId: { in: productIds },
      ...(productId ? { productId } : {}),
      ...(rating ? { rating } : {}),
      ...(status ? { status: status as Prisma.ReviewWhereInput['status'] } : {}),
      ...(search ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { comment: { contains: search, mode: 'insensitive' } }] } : {}),
      ...(replyFilter === 'hasReply' ? { replies: { some: {} } } : {}),
      ...(replyFilter === 'noReply' ? { replies: { none: {} } } : {}),
    }

    const { items, total } = await offsetPaginate(prisma.review, {
      page,
      pageSize,
      where,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        replies: { orderBy: { createdAt: 'asc' } },
        _count: { select: { reports: true } },
      },
      orderBy: { [sort]: order },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async getById(shopId: string, reviewId: string) {
    const review = await prisma.review.findFirst({
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
    const review = await prisma.review.findFirst({
      where: { id: reviewId, productId: { in: await this.getShopProductIds(shopId) } },
    })

    if (!review) {
      throw new NotFoundException('Review not found')
    }

    return prisma.reviewReply.create({
      data: { reviewId, shopId, message },
    })
  }

  async report(shopId: string, reviewId: string, reason: string, details?: string) {
    const review = await prisma.review.findFirst({
      where: { id: reviewId, productId: { in: await this.getShopProductIds(shopId) } },
    })

    if (!review) {
      throw new NotFoundException('Review not found')
    }

    return prisma.reviewReport.create({
      data: { reviewId, shopId, reason, details },
    })
  }

  async getAnalytics(shopId: string) {
    const productIds = await this.getShopProductIds(shopId)

    const [totalReviews, ratingDist, avgRating] = await Promise.all([
      prisma.review.count({ where: { productId: { in: productIds }, status: 'APPROVED' } }),
      prisma.review.groupBy({
        by: ['rating'],
        where: { productId: { in: productIds }, status: 'APPROVED' },
        _count: true,
      }),
      prisma.review.aggregate({
        where: { productId: { in: productIds }, status: 'APPROVED' },
        _avg: { rating: true },
      }),
    ])

    return {
      totalReviews,
      averageRating: avgRating._avg.rating ?? 0,
      ratingDistribution: ratingDist.map((r: { rating: number; _count: number }) => ({ rating: r.rating, count: r._count })),
    }
  }

  private async getShopProductIds(shopId: string): Promise<string[]> {
    const products = await prisma.product.findMany({
      where: { shopId, deletedAt: null },
      select: { id: true },
    })
    return products.map((p: { id: string }) => p.id)
  }
}

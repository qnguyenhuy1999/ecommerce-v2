import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { prisma, Prisma } from '@ecom/database'
import { CreateAffiliateLinkDto, RequestPayoutDto } from './dto/affiliate.dto'
import { offsetPaginate, buildOffsetResponse, OffsetPaginationDto } from '@ecom/pagination'
import { randomBytes } from 'crypto'

@Injectable()
export class AffiliateService {
  async getPartnerByUserId(userId: string) {
    return prisma.affiliatePartner.findUnique({ where: { userId } })
  }

  async listPartners(query: OffsetPaginationDto) {
    const { page = 1, pageSize = 20 } = query

    const { items, total } = await offsetPaginate(prisma.affiliatePartner, {
      page,
      pageSize,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async updatePartnerStatus(partnerId: string, status: string) {
    const partner = await prisma.affiliatePartner.findUnique({ where: { id: partnerId } })
    if (!partner) throw new NotFoundException('Partner not found')

    return prisma.affiliatePartner.update({
      where: { id: partnerId },
      data: { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' },
    })
  }

  async createLink(partnerId: string, dto: CreateAffiliateLinkDto) {
    const code = randomBytes(8).toString('hex')

    return prisma.affiliateLink.create({
      data: {
        partnerId,
        productId: dto.productId,
        shopId: dto.shopId,
        code,
        url: dto.url,
      },
    })
  }

  async listLinks(partnerId: string, query: OffsetPaginationDto) {
    const { page = 1, pageSize = 20 } = query

    const where: Prisma.AffiliateLinkWhereInput = { partnerId }

    const { items, total } = await offsetPaginate(prisma.affiliateLink, {
      page,
      pageSize,
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async trackClick(
    code: string,
    visitorId?: string,
    ipAddress?: string,
    userAgent?: string,
    referer?: string,
  ) {
    const link = await prisma.affiliateLink.findUnique({ where: { code } })
    if (!link) throw new NotFoundException('Link not found')

    await prisma.$transaction([
      prisma.affiliateClick.create({
        data: { linkId: link.id, visitorId, ipAddress, userAgent, referer },
      }),
      prisma.affiliateLink.update({
        where: { id: link.id },
        data: { clicks: { increment: 1 } },
      }),
    ])

    return { url: link.url }
  }

  async recordConversion(linkCode: string, orderId: string, buyerId: string, orderAmount: number) {
    const link = await prisma.affiliateLink.findUnique({
      where: { code: linkCode },
      include: { partner: true },
    })

    if (!link) throw new NotFoundException('Affiliate link not found')

    const commissionRate = Number(link.partner.commissionRate)
    const commissionAmount = (orderAmount * commissionRate) / 100

    await prisma.$transaction([
      prisma.affiliateConversion.create({
        data: {
          linkId: link.id,
          orderId,
          buyerId,
          orderAmount,
          commissionRate,
          commissionAmount,
        },
      }),
      prisma.affiliateLink.update({
        where: { id: link.id },
        data: { conversions: { increment: 1 } },
      }),
      prisma.affiliatePartner.update({
        where: { id: link.partnerId },
        data: {
          totalEarnings: { increment: commissionAmount },
          pendingBalance: { increment: commissionAmount },
        },
      }),
    ])
  }

  async requestPayout(partnerId: string, dto: RequestPayoutDto) {
    const partner = await prisma.affiliatePartner.findUnique({ where: { id: partnerId } })
    if (!partner) throw new NotFoundException('Partner not found')

    if (Number(partner.pendingBalance) < dto.amount) {
      throw new BadRequestException('Insufficient balance')
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const payout = await tx.commissionPayout.create({
        data: {
          partnerId,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod,
          note: dto.note,
        },
      })

      await tx.affiliatePartner.update({
        where: { id: partnerId },
        data: { pendingBalance: { decrement: dto.amount } },
      })

      return payout
    })
  }

  async getPartnerAnalytics(partnerId: string) {
    const partner = await prisma.affiliatePartner.findUnique({ where: { id: partnerId } })
    if (!partner) throw new NotFoundException('Partner not found')

    const [totalLinks, totalClicks, totalConversions, recentConversions] = await Promise.all([
      prisma.affiliateLink.count({ where: { partnerId } }),
      prisma.affiliateClick.count({ where: { link: { partnerId } } }),
      prisma.affiliateConversion.count({ where: { link: { partnerId } } }),
      prisma.affiliateConversion.findMany({
        where: { link: { partnerId } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

    return {
      partner,
      stats: {
        totalLinks,
        totalClicks,
        totalConversions,
        conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
        totalEarnings: partner.totalEarnings,
        pendingBalance: partner.pendingBalance,
      },
      recentConversions,
    }
  }
}

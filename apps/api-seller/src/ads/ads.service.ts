import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma, Prisma } from '@ecom/database'
import { CreateAdCampaignDto, CreateAdGroupDto, CreateAdDto } from './dto/create-ad-campaign.dto'
import { buildPaginationMeta, PaginationDto } from '../common/dto/pagination.dto'

@Injectable()
export class AdsService {
  async listCampaigns(shopId: string, query: PaginationDto) {
    const { page = 1, limit = 20, sort = 'createdAt', order = 'desc' } = query

    const where: Prisma.AdCampaignWhereInput = { shopId }

    const [campaigns, total] = await Promise.all([
      prisma.adCampaign.findMany({
        where,
        include: { _count: { select: { adGroups: true } } },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.adCampaign.count({ where }),
    ])

    return { data: campaigns, meta: buildPaginationMeta(page, limit, total) }
  }

  async getCampaignById(shopId: string, id: string) {
    const campaign = await prisma.adCampaign.findFirst({
      where: { id, shopId },
      include: {
        adGroups: {
          include: {
            ads: true,
            keywords: true,
          },
        },
      },
    })

    if (!campaign) throw new NotFoundException('Ad campaign not found')
    return campaign
  }

  async createCampaign(shopId: string, dto: CreateAdCampaignDto) {
    return prisma.adCampaign.create({
      data: {
        shopId,
        name: dto.name,
        type:
          (dto.type as 'SPONSORED_PRODUCT' | 'SEARCH_AD' | 'RECOMMENDATION_AD' | 'BANNER') ??
          'SPONSORED_PRODUCT',
        dailyBudget: dto.dailyBudget,
        totalBudget: dto.totalBudget,
        bidAmount: dto.bidAmount,
        startsAt: new Date(dto.startsAt),
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      },
    })
  }

  async updateCampaignStatus(shopId: string, id: string, status: string) {
    const campaign = await prisma.adCampaign.findFirst({ where: { id, shopId } })
    if (!campaign) throw new NotFoundException('Campaign not found')

    return prisma.adCampaign.update({
      where: { id },
      data: { status: status as 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ENDED' | 'DEPLETED' },
    })
  }

  async createAdGroup(shopId: string, dto: CreateAdGroupDto) {
    const campaign = await prisma.adCampaign.findFirst({
      where: { id: dto.campaignId, shopId },
    })
    if (!campaign) throw new NotFoundException('Campaign not found')

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const group = await tx.adGroup.create({
        data: {
          campaignId: dto.campaignId,
          name: dto.name,
        },
      })

      if (dto.keywords?.length) {
        await tx.adKeyword.createMany({
          data: dto.keywords.map((kw) => ({
            adGroupId: group.id,
            keyword: kw.keyword.toLowerCase(),
            bidAmount: kw.bidAmount,
          })),
        })
      }

      return tx.adGroup.findUnique({
        where: { id: group.id },
        include: { keywords: true },
      })
    })
  }

  async createAd(shopId: string, dto: CreateAdDto) {
    const adGroup = await prisma.adGroup.findFirst({
      where: { id: dto.adGroupId, campaign: { shopId } },
    })
    if (!adGroup) throw new NotFoundException('Ad group not found')

    const product = await prisma.product.findFirst({
      where: { id: dto.productId, shopId, deletedAt: null },
    })
    if (!product) throw new NotFoundException('Product not found')

    return prisma.ad.create({
      data: {
        adGroupId: dto.adGroupId,
        productId: dto.productId,
      },
    })
  }

  async getCampaignAnalytics(shopId: string, campaignId: string) {
    const campaign = await prisma.adCampaign.findFirst({
      where: { id: campaignId, shopId },
      include: {
        adGroups: {
          include: {
            ads: {
              select: {
                id: true,
                productId: true,
                impressions: true,
                clicks: true,
                conversions: true,
                spent: true,
              },
            },
          },
        },
      },
    })

    if (!campaign) throw new NotFoundException('Campaign not found')

    const totals = campaign.adGroups.reduce(
      (
        acc: { impressions: number; clicks: number; conversions: number; spent: number },
        group: { ads: Array<{ impressions: number; clicks: number; conversions: number; spent: number }> },
      ) => {
        for (const ad of group.ads) {
          acc.impressions += ad.impressions
          acc.clicks += ad.clicks
          acc.conversions += ad.conversions
          acc.spent += Number(ad.spent)
        }
        return acc
      },
      { impressions: 0, clicks: 0, conversions: 0, spent: 0 },
    )

    return {
      campaign,
      totals: {
        ...totals,
        ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
        conversionRate: totals.clicks > 0 ? (totals.conversions / totals.clicks) * 100 : 0,
        cpc: totals.clicks > 0 ? totals.spent / totals.clicks : 0,
      },
    }
  }
}

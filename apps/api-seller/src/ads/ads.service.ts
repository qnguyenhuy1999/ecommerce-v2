import { Injectable, NotFoundException } from '@nestjs/common'
import type { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { AdType, AdCampaignStatus } from '@ecom/database'
import type {
  CreateAdCampaignDto,
  CreateAdGroupDto,
  CreateAdDto,
} from './dto/create-ad-campaign.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'
import type { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

@Injectable()
export class AdsService {
  constructor(private readonly prisma: PrismaService) {}
  async listCampaigns(shopId: string, query: OffsetPaginationDto) {
    const { page = 1, pageSize = 20, sortBy = 'createdAt', sortOrder = 'desc', sort, order } = query

    const finalSort = sort || sortBy
    const finalOrder = order || sortOrder

    const where: Prisma.AdCampaignWhereInput = { shopId }

    const { items, total } = await offsetPaginate(this.prisma.adCampaign, {
      page,
      pageSize,
      where,
      include: { _count: { select: { adGroups: true } } },
      orderBy: { [finalSort]: finalOrder },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async getCampaignById(shopId: string, id: string) {
    const campaign = await this.prisma.adCampaign.findFirst({
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
    return this.prisma.adCampaign.create({
      data: {
        shopId,
        name: dto.name,
        type: dto.type ?? AdType.SPONSORED_PRODUCT,
        dailyBudget: dto.dailyBudget,
        ...(dto.totalBudget !== undefined ? { totalBudget: dto.totalBudget } : {}),
        bidAmount: dto.bidAmount,
        startsAt: new Date(dto.startsAt),
        ...(dto.endsAt !== undefined ? { endsAt: new Date(dto.endsAt) } : {}),
      },
    })
  }

  async updateCampaignStatus(shopId: string, id: string, status: AdCampaignStatus) {
    const campaign = await this.prisma.adCampaign.findFirst({ where: { id, shopId } })
    if (!campaign) throw new NotFoundException('Campaign not found')

    return this.prisma.adCampaign.update({
      where: { id },
      data: { status },
    })
  }

  async createAdGroup(shopId: string, dto: CreateAdGroupDto) {
    const campaign = await this.prisma.adCampaign.findFirst({
      where: { id: dto.campaignId, shopId },
    })
    if (!campaign) throw new NotFoundException('Campaign not found')

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
            ...(kw.bidAmount !== undefined ? { bidAmount: kw.bidAmount } : {}),
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
    const adGroup = await this.prisma.adGroup.findFirst({
      where: { id: dto.adGroupId, campaign: { shopId } },
    })
    if (!adGroup) throw new NotFoundException('Ad group not found')

    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, shopId, deletedAt: null },
    })
    if (!product) throw new NotFoundException('Product not found')

    return this.prisma.ad.create({
      data: {
        adGroupId: dto.adGroupId,
        productId: dto.productId,
      },
    })
  }

  async getCampaignAnalytics(shopId: string, campaignId: string) {
    const campaign = await this.prisma.adCampaign.findFirst({
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

    const totals = { impressions: 0, clicks: 0, conversions: 0, spent: 0 }

    for (const group of campaign.adGroups) {
      for (const ad of group.ads) {
        totals.impressions += Number(ad.impressions)
        totals.clicks += Number(ad.clicks)
        totals.conversions += Number(ad.conversions)
        totals.spent += Number(ad.spent)
      }
    }

    return {
      campaign,
      totals: {
        impressions: totals.impressions,
        clicks: totals.clicks,
        conversions: totals.conversions,
        spent: totals.spent,
        ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
        conversionRate: totals.clicks > 0 ? (totals.conversions / totals.clicks) * 100 : 0,
        cpc: totals.clicks > 0 ? totals.spent / totals.clicks : 0,
      },
    }
  }
}

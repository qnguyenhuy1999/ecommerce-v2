import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService, Prisma } from '@ecom/database'
import { FlashSaleStatus, ProductStatus } from '@ecom/contracts'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { CreateFlashSaleCampaignDto } from './dto/create-flash-sale.dto'
import { ApplyFlashSaleSlotDto } from './dto/apply-flash-sale-slot.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

@Injectable()
export class FlashSaleService {
  constructor(private readonly prisma: PrismaService) {}
  async listCampaigns(query: OffsetPaginationDto) {
    const { page = PAGINATION_DEFAULTS.DEFAULT_PAGE, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT } = query

    const where: Prisma.FlashSaleCampaignWhereInput = {
      status: { in: [FlashSaleStatus.SCHEDULED, FlashSaleStatus.ACTIVE] },
      isVisible: true,
    }

    const { items, total } = await offsetPaginate(this.prisma.flashSaleCampaign, {
      page,
      limit,
      where,
      include: { _count: { select: { slots: true } } },
      orderBy: { startsAt: 'asc' },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async getCampaignById(id: string) {
    const campaign = await this.prisma.flashSaleCampaign.findUnique({
      where: { id },
      include: {
        slots: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { slots: true } },
      },
    })

    if (!campaign) throw new NotFoundException('Flash sale campaign not found')
    return campaign
  }

  async createCampaign(dto: CreateFlashSaleCampaignDto, createdBy?: string) {
    const startsAt = new Date(dto.startsAt)
    const endsAt = new Date(dto.endsAt)

    if (endsAt <= startsAt) {
      throw new BadRequestException('End time must be after start time')
    }

    return this.prisma.flashSaleCampaign.create({
      data: {
        name: dto.name,
        description: dto.description,
        startsAt,
        endsAt,
        maxSlotsPerSeller: dto.maxSlotsPerSeller ?? 5,
        isVisible: dto.isVisible ?? false,
        createdBy,
      },
    })
  }

  async updateCampaignStatus(id: string, status: string) {
    const campaign = await this.prisma.flashSaleCampaign.findUnique({ where: { id } })
    if (!campaign) throw new NotFoundException('Campaign not found')

    return this.prisma.flashSaleCampaign.update({
      where: { id },
      data: { status: status as Prisma.FlashSaleCampaignUpdateInput['status'] },
    })
  }

  async applySlot(shopId: string, dto: ApplyFlashSaleSlotDto) {
    const campaign = await this.prisma.flashSaleCampaign.findUnique({
      where: { id: dto.campaignId },
    })

    if (!campaign) throw new NotFoundException('Campaign not found')
    if (campaign.status !== FlashSaleStatus.DRAFT && campaign.status !== FlashSaleStatus.SCHEDULED) {
      throw new BadRequestException('Campaign is not accepting applications')
    }

    const existingSlots = await this.prisma.flashSaleSlot.count({
      where: { campaignId: dto.campaignId, shopId },
    })

    if (existingSlots >= campaign.maxSlotsPerSeller) {
      throw new BadRequestException(`Maximum ${campaign.maxSlotsPerSeller} slots per seller`)
    }

    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, shopId, deletedAt: null, status: ProductStatus.PUBLISHED },
    })

    if (!product) throw new NotFoundException('Product not found or not published')

    return this.prisma.flashSaleSlot.create({
      data: {
        campaignId: dto.campaignId,
        shopId,
        productId: dto.productId,
        variantId: dto.variantId,
        originalPrice: product.basePrice ?? 0,
        salePrice: dto.salePrice,
        totalStock: dto.totalStock,
        purchaseLimit: dto.purchaseLimit ?? 1,
      },
    })
  }

  async listSellerSlots(shopId: string, query: OffsetPaginationDto) {
    const { page = PAGINATION_DEFAULTS.DEFAULT_PAGE, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT } = query

    const where: Prisma.FlashSaleSlotWhereInput = { shopId }

    const { items, total } = await offsetPaginate(this.prisma.flashSaleSlot, {
      page,
      limit,
      where,
      include: {
        campaign: {
          select: { id: true, name: true, startsAt: true, endsAt: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async approveSlot(slotId: string) {
    return this.prisma.flashSaleSlot.update({
      where: { id: slotId },
      data: { status: 'APPROVED' },
    })
  }

  async rejectSlot(slotId: string) {
    return this.prisma.flashSaleSlot.update({
      where: { id: slotId },
      data: { status: 'REJECTED' },
    })
  }
}

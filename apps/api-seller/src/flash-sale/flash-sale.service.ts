import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { prisma, Prisma } from '@ecom/database'
import { CreateFlashSaleCampaignDto } from './dto/create-flash-sale.dto'
import { ApplyFlashSaleSlotDto } from './dto/apply-flash-sale-slot.dto'
import { offsetPaginate, buildOffsetResponse, OffsetPaginationDto } from '@ecom/pagination'

@Injectable()
export class FlashSaleService {
  async listCampaigns(query: OffsetPaginationDto) {
    const { page = 1, pageSize = 20 } = query

    const where: Prisma.FlashSaleCampaignWhereInput = {
      status: { in: ['SCHEDULED', 'ACTIVE'] },
      isVisible: true,
    }

    const { items, total } = await offsetPaginate(prisma.flashSaleCampaign, {
      page,
      pageSize,
      where,
      include: { _count: { select: { slots: true } } },
      orderBy: { startsAt: 'asc' },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async getCampaignById(id: string) {
    const campaign = await prisma.flashSaleCampaign.findUnique({
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

    return prisma.flashSaleCampaign.create({
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
    const campaign = await prisma.flashSaleCampaign.findUnique({ where: { id } })
    if (!campaign) throw new NotFoundException('Campaign not found')

    return prisma.flashSaleCampaign.update({
      where: { id },
      data: { status: status as 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED' },
    })
  }

  async applySlot(shopId: string, dto: ApplyFlashSaleSlotDto) {
    const campaign = await prisma.flashSaleCampaign.findUnique({
      where: { id: dto.campaignId },
    })

    if (!campaign) throw new NotFoundException('Campaign not found')
    if (campaign.status !== 'DRAFT' && campaign.status !== 'SCHEDULED') {
      throw new BadRequestException('Campaign is not accepting applications')
    }

    const existingSlots = await prisma.flashSaleSlot.count({
      where: { campaignId: dto.campaignId, shopId },
    })

    if (existingSlots >= campaign.maxSlotsPerSeller) {
      throw new BadRequestException(`Maximum ${campaign.maxSlotsPerSeller} slots per seller`)
    }

    const product = await prisma.product.findFirst({
      where: { id: dto.productId, shopId, deletedAt: null, status: 'PUBLISHED' },
    })

    if (!product) throw new NotFoundException('Product not found or not published')

    return prisma.flashSaleSlot.create({
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
    const { page = 1, pageSize = 20 } = query

    const where: Prisma.FlashSaleSlotWhereInput = { shopId }

    const { items, total } = await offsetPaginate(prisma.flashSaleSlot, {
      page,
      pageSize,
      where,
      include: {
        campaign: {
          select: { id: true, name: true, startsAt: true, endsAt: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async approveSlot(slotId: string) {
    return prisma.flashSaleSlot.update({
      where: { id: slotId },
      data: { status: 'APPROVED' },
    })
  }

  async rejectSlot(slotId: string) {
    return prisma.flashSaleSlot.update({
      where: { id: slotId },
      data: { status: 'REJECTED' },
    })
  }
}

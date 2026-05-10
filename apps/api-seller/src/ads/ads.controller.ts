import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { AdsService } from './ads.service'
import { CreateAdCampaignDto, CreateAdGroupDto, CreateAdDto } from './dto/create-ad-campaign.dto'
import { OffsetPaginationDto } from '@ecom/shared/pagination/core'

@Controller('ads')
@UseGuards(AuthGuard)
export class AdsController {
  constructor(
    private readonly adsService: AdsService,
    private readonly shopService: ShopService,
  ) {}

  @Get('campaigns')
  async listCampaigns(@CurrentUser() user: SessionData, @Query() query: OffsetPaginationDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.adsService.listCampaigns(shopId, query)
  }

  @Get('campaigns/:id')
  async getCampaign(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.adsService.getCampaignById(shopId, id)
  }

  @Post('campaigns')
  async createCampaign(@CurrentUser() user: SessionData, @Body() dto: CreateAdCampaignDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.adsService.createCampaign(shopId, dto)
  }

  @Put('campaigns/:id/status')
  async updateStatus(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.adsService.updateCampaignStatus(shopId, id, body.status)
  }

  @Post('groups')
  async createAdGroup(@CurrentUser() user: SessionData, @Body() dto: CreateAdGroupDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.adsService.createAdGroup(shopId, dto)
  }

  @Post('items')
  async createAd(@CurrentUser() user: SessionData, @Body() dto: CreateAdDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.adsService.createAd(shopId, dto)
  }

  @Get('campaigns/:id/analytics')
  async getCampaignAnalytics(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.adsService.getCampaignAnalytics(shopId, id)
  }
}

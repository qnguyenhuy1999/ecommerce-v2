import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import {
  ApiOkResponseData,
  ApiCreatedResponseData,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-openapi'
import { ShopService } from '../shop/shop.service'
import { AdsService } from './ads.service'
import { CreateAdCampaignDto, CreateAdGroupDto, CreateAdDto } from './dto/create-ad-campaign.dto'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

@ApiTags('Seller/Ads')
@ApiAuth()
@ApiErrorResponses()
@Controller('ads')
@UseGuards(AuthGuard)
export class AdsController {
  constructor(
    private readonly adsService: AdsService,
    private readonly shopService: ShopService,
  ) {}

  @Get('campaigns')
  @ApiPaginatedResponse(Object)
  async listCampaigns(@CurrentUser() user: SessionData, @Query() query: OffsetPaginationDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.adsService.listCampaigns(shopId, query)
  }

  @Get('campaigns/:id')
  @ApiOkResponseData(Object)
  async getCampaign(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.adsService.getCampaignById(shopId, id)
  }

  @Post('campaigns')
  @ApiCreatedResponseData(Object)
  async createCampaign(@CurrentUser() user: SessionData, @Body() dto: CreateAdCampaignDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.adsService.createCampaign(shopId, dto)
  }

  @Put('campaigns/:id/status')
  @ApiOkResponseData(Object)
  async updateStatus(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.adsService.updateCampaignStatus(shopId, id, body.status)
  }

  @Post('groups')
  @ApiCreatedResponseData(Object)
  async createAdGroup(@CurrentUser() user: SessionData, @Body() dto: CreateAdGroupDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.adsService.createAdGroup(shopId, dto)
  }

  @Post('items')
  @ApiCreatedResponseData(Object)
  async createAd(@CurrentUser() user: SessionData, @Body() dto: CreateAdDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.adsService.createAd(shopId, dto)
  }

  @Get('campaigns/:id/analytics')
  @ApiOkResponseData(Object)
  async getCampaignAnalytics(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.adsService.getCampaignAnalytics(shopId, id)
  }
}

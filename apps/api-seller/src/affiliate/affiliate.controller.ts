import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common'
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
} from '@ecom/nestjs-core/openapi'
import { AffiliateService } from './affiliate.service'
import { CreateAffiliateLinkDto, RequestPayoutDto } from './dto/affiliate.dto'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

@ApiTags('Seller/Affiliates')
@ApiAuth()
@ApiErrorResponses()
@Controller('affiliates')
@UseGuards(AuthGuard)
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Get('me')
  @ApiOkResponseData(Object)
  async getMyProfile(@CurrentUser() user: SessionData) {
    return this.affiliateService.getPartnerByUserId(user.userId)
  }

  @Get('me/analytics')
  @ApiOkResponseData(Object)
  async getMyAnalytics(@CurrentUser() user: SessionData) {
    const partner = await this.affiliateService.getPartnerByUserId(user.userId)
    if (!partner) return null
    return this.affiliateService.getPartnerAnalytics(partner.id)
  }

  @Post('links')
  @ApiCreatedResponseData(Object)
  async createLink(@CurrentUser() user: SessionData, @Body() dto: CreateAffiliateLinkDto) {
    const partner = await this.affiliateService.getPartnerByUserId(user.userId)
    if (!partner) return null
    return this.affiliateService.createLink(partner.id, dto)
  }

  @Get('links')
  @ApiPaginatedResponse(Object)
  async listLinks(@CurrentUser() user: SessionData, @Query() query: OffsetPaginationDto) {
    const partner = await this.affiliateService.getPartnerByUserId(user.userId)
    if (!partner) return { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } }
    return this.affiliateService.listLinks(partner.id, query)
  }

  @Post('payouts')
  @ApiCreatedResponseData(Object)
  async requestPayout(@CurrentUser() user: SessionData, @Body() dto: RequestPayoutDto) {
    const partner = await this.affiliateService.getPartnerByUserId(user.userId)
    if (!partner) return null
    return this.affiliateService.requestPayout(partner.id, dto)
  }
}

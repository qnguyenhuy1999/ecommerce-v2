import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { AffiliateService } from './affiliate.service'
import { CreateAffiliateLinkDto, RequestPayoutDto } from './dto/affiliate.dto'
import { OffsetPaginationDto } from '@ecom/shared/pagination/core'

@Controller('affiliates')
@UseGuards(AuthGuard)
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Get('me')
  async getMyProfile(@CurrentUser() user: SessionData) {
    return this.affiliateService.getPartnerByUserId(user.userId)
  }

  @Get('me/analytics')
  async getMyAnalytics(@CurrentUser() user: SessionData) {
    const partner = await this.affiliateService.getPartnerByUserId(user.userId)
    if (!partner) return null
    return this.affiliateService.getPartnerAnalytics(partner.id)
  }

  @Post('links')
  async createLink(@CurrentUser() user: SessionData, @Body() dto: CreateAffiliateLinkDto) {
    const partner = await this.affiliateService.getPartnerByUserId(user.userId)
    if (!partner) return null
    return this.affiliateService.createLink(partner.id, dto)
  }

  @Get('links')
  async listLinks(@CurrentUser() user: SessionData, @Query() query: OffsetPaginationDto) {
    const partner = await this.affiliateService.getPartnerByUserId(user.userId)
    if (!partner) return { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } }
    return this.affiliateService.listLinks(partner.id, query)
  }

  @Post('payouts')
  async requestPayout(@CurrentUser() user: SessionData, @Body() dto: RequestPayoutDto) {
    const partner = await this.affiliateService.getPartnerByUserId(user.userId)
    if (!partner) return null
    return this.affiliateService.requestPayout(partner.id, dto)
  }
}

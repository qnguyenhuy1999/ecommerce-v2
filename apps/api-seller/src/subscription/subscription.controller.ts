import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { SubscriptionService } from './subscription.service'
import { SubscribeDto } from './dto/subscription.dto'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

@Controller('subscriptions')
@UseGuards(AuthGuard)
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly shopService: ShopService,
  ) {}

  @Get('plans')
  async listPlans() {
    return this.subscriptionService.listPlans()
  }

  @Get('plans/:id')
  async getPlan(@Param('id') id: string) {
    return this.subscriptionService.getPlanById(id)
  }

  @Get('current')
  async getCurrentSubscription(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.subscriptionService.getSubscription(shopId)
  }

  @Post('subscribe')
  async subscribe(@CurrentUser() user: SessionData, @Body() dto: SubscribeDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.subscriptionService.subscribe(shopId, dto)
  }

  @Delete('cancel')
  async cancel(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.subscriptionService.cancelSubscription(shopId)
  }

  @Get('invoices')
  async listInvoices(@CurrentUser() user: SessionData, @Query() query: OffsetPaginationDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.subscriptionService.listInvoices(shopId, query)
  }

  @Get('entitlements/:feature')
  async checkEntitlement(@CurrentUser() user: SessionData, @Param('feature') feature: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.subscriptionService.checkEntitlement(shopId, feature)
  }
}

import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ApiOkResponseData, ApiErrorResponses, ApiAuth } from '@ecom/nestjs-core/openapi'
import type { ShopService } from '../shop/shop.service'
import type { AnalyticsService } from './analytics.service'

@ApiTags('Seller/Analytics')
@ApiAuth()
@ApiErrorResponses()
@Controller('analytics')
@UseGuards(AuthGuard)
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly shopService: ShopService,
  ) {}

  @Get('dashboard')
  @ApiOkResponseData(Object)
  async dashboard(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.analyticsService.getDashboardSummary(shopId)
  }

  @Get('revenue')
  @ApiOkResponseData(Object)
  async revenue(
    @CurrentUser() user: SessionData,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()
    return this.analyticsService.getRevenueAnalytics(shopId, start, end)
  }

  @Get('orders')
  @ApiOkResponseData(Object)
  async orders(
    @CurrentUser() user: SessionData,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()
    return this.analyticsService.getOrderAnalytics(shopId, start, end)
  }

  @Get('products')
  @ApiOkResponseData(Object)
  async products(
    @CurrentUser() user: SessionData,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()
    return this.analyticsService.getProductPerformance(shopId, start, end)
  }

  @Get('conversion')
  @ApiOkResponseData(Object)
  async conversion(
    @CurrentUser() user: SessionData,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()
    return this.analyticsService.getConversionMetrics(shopId, start, end)
  }
}

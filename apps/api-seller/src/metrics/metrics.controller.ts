import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import {
  ApiOkResponseData,
  ApiCreatedResponseData,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-core/openapi'
import { ShopService } from '../shop/shop.service'
import { MetricsService } from './metrics.service'

@ApiTags('Seller/Metrics')
@ApiAuth()
@ApiErrorResponses()
@Controller('metrics')
@UseGuards(AuthGuard)
export class MetricsController {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  @ApiOkResponseData(Object)
  async current(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.metricsService.getCurrentMetrics(shopId)
  }

  @Get('history')
  @ApiOkResponseData(Object)
  async history(@CurrentUser() user: SessionData, @Query('days') days?: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.metricsService.getMetricHistory(shopId, days ? parseInt(days, 10) : 30)
  }

  @Post('snapshot')
  @ApiCreatedResponseData(Object)
  async snapshot(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.metricsService.takeSnapshot(shopId)
  }
}

import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common'
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
import type { ShopService } from '../shop/shop.service'
import type { ShippingService } from './shipping.service'
import type { CreateShipmentDto } from './dto/create-shipment.dto'

@ApiTags('Seller/Shipping')
@ApiAuth()
@ApiErrorResponses()
@Controller('shipping')
@UseGuards(AuthGuard)
export class ShippingController {
  constructor(
    private readonly shippingService: ShippingService,
    private readonly shopService: ShopService,
  ) {}

  @Get('providers')
  @ApiOkResponseData(Object)
  async listProviders() {
    return this.shippingService.listProviders()
  }

  @Get('methods')
  @ApiOkResponseData(Object)
  async getSellerMethods(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.shippingService.getSellerMethods(shopId)
  }

  @Post('methods/:providerId/toggle')
  @ApiOkResponseData(Object)
  async toggleMethod(
    @CurrentUser() user: SessionData,
    @Param('providerId') providerId: string,
    @Body() body: { isEnabled: boolean },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.shippingService.toggleMethod(shopId, providerId, body.isEnabled)
  }

  @Post('shipments')
  @ApiCreatedResponseData(Object)
  async createShipment(@CurrentUser() user: SessionData, @Body() dto: CreateShipmentDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.shippingService.createShipment(
      shopId,
      dto.sellerOrderId,
      dto.providerId,
      dto.trackingNumber,
    )
  }

  @Put('shipments/:id/tracking')
  @ApiOkResponseData(Object)
  async updateTracking(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() body: { trackingNumber: string },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.shippingService.updateTracking(shopId, id, body.trackingNumber)
  }
}

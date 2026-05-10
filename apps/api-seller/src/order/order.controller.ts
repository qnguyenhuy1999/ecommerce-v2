import { Controller, Get, Put, Param, Query, Body, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import {
  ApiOkResponseData,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-openapi'
import { ShopService } from '../shop/shop.service'
import { OrderService } from './order.service'
import { OrderQueryDto } from './dto/order-query.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'

@ApiTags('Seller/Orders')
@ApiAuth()
@ApiErrorResponses()
@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  @ApiPaginatedResponse(Object)
  async list(@CurrentUser() user: SessionData, @Query() query: OrderQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.orderService.list(shopId, query)
  }

  @Get(':id')
  @ApiOkResponseData(Object)
  async getById(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.orderService.getById(shopId, id)
  }

  @Put(':id/status')
  @ApiOkResponseData(Object)
  async updateStatus(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.orderService.updateStatus(shopId, id, dto.status, dto.note, user.userId)
  }
}

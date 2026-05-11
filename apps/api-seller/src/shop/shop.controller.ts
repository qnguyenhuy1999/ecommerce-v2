import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import {
  ApiOkResponseData,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-core/openapi'
import { ShopService } from './shop.service'
import type { UpdateShopDto } from './dto/update-shop.dto'

@ApiTags('Seller/Shop')
@ApiAuth()
@ApiErrorResponses()
@Controller('shop')
@UseGuards(AuthGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  @ApiOkResponseData(Object)
  async getShop(@CurrentUser() user: SessionData) {
    return this.shopService.getShop(user.userId)
  }

  @Put()
  @ApiOkResponseData(Object)
  async updateShop(@CurrentUser() user: SessionData, @Body() dto: UpdateShopDto) {
    return this.shopService.updateShop(user.userId, dto)
  }
}

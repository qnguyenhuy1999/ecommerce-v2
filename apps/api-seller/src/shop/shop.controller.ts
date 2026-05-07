import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from './shop.service'
import { UpdateShopDto } from './dto/update-shop.dto'

@Controller('shop')
@UseGuards(AuthGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  async getShop(@CurrentUser() user: SessionData) {
    return this.shopService.getShop(user.userId)
  }

  @Put()
  async updateShop(@CurrentUser() user: SessionData, @Body() dto: UpdateShopDto) {
    return this.shopService.updateShop(user.userId, dto)
  }
}

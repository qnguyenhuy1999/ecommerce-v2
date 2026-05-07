import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { CouponService } from './coupon.service'
import { CreateCouponDto } from './dto/create-coupon.dto'
import { UpdateCouponDto } from './dto/update-coupon.dto'
import { CouponQueryDto } from './dto/coupon-query.dto'

@Controller('coupons')
@UseGuards(AuthGuard)
export class CouponController {
  constructor(
    private readonly couponService: CouponService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  async list(@CurrentUser() user: SessionData, @Query() query: CouponQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.couponService.list(shopId, query)
  }

  @Get('stats')
  async stats(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.couponService.getStats(shopId)
  }

  @Get(':id')
  async getById(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.couponService.getById(shopId, id)
  }

  @Post()
  async create(@CurrentUser() user: SessionData, @Body() dto: CreateCouponDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.couponService.create(shopId, dto)
  }

  @Put(':id')
  async update(@CurrentUser() user: SessionData, @Param('id') id: string, @Body() dto: UpdateCouponDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.couponService.update(shopId, id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    await this.couponService.delete(shopId, id)
  }
}

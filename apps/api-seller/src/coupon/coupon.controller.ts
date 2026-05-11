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
import { ShopService } from '../shop/shop.service'
import { CouponService } from './coupon.service'
import type { CreateCouponDto } from './dto/create-coupon.dto'
import type { UpdateCouponDto } from './dto/update-coupon.dto'
import type { CouponQueryDto } from './dto/coupon-query.dto'

@ApiTags('Seller/Coupons')
@ApiAuth()
@ApiErrorResponses()
@Controller('coupons')
@UseGuards(AuthGuard)
export class CouponController {
  constructor(
    private readonly couponService: CouponService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  @ApiPaginatedResponse(Object)
  async list(@CurrentUser() user: SessionData, @Query() query: CouponQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.couponService.list(shopId, query)
  }

  @Get('stats')
  @ApiOkResponseData(Object)
  async stats(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.couponService.getStats(shopId)
  }

  @Get(':id')
  @ApiOkResponseData(Object)
  async getById(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.couponService.getById(shopId, id)
  }

  @Post()
  @ApiCreatedResponseData(Object)
  async create(@CurrentUser() user: SessionData, @Body() dto: CreateCouponDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.couponService.create(shopId, dto)
  }

  @Put(':id')
  @ApiOkResponseData(Object)
  async update(@CurrentUser() user: SessionData, @Param('id') id: string, @Body() dto: UpdateCouponDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.couponService.update(shopId, id, dto)
  }

  @Delete(':id')
  @ApiOkResponseData(Object)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    await this.couponService.delete(shopId, id)
  }
}

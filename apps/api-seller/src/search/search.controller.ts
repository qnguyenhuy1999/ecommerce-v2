import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { SearchService } from './search.service'
import { ProductSearchDto, OrderSearchDto } from './dto/search-query.dto'

@Controller('search')
@UseGuards(AuthGuard)
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly shopService: ShopService,
  ) {}

  @Get('products')
  async searchProducts(@CurrentUser() user: SessionData, @Query() query: ProductSearchDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.searchService.searchProducts(shopId, query)
  }

  @Get('orders')
  async searchOrders(@CurrentUser() user: SessionData, @Query() query: OrderSearchDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.searchService.searchOrders(shopId, query)
  }

  @Get('filters')
  async listFilters(
    @CurrentUser() user: SessionData,
    @Query('entity') entity?: string,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.searchService.listSavedFilters(shopId, user.userId, entity)
  }

  @Post('filters')
  async saveFilter(
    @CurrentUser() user: SessionData,
    @Body() body: { name: string; entity: string; filters: Record<string, unknown> },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.searchService.saveFilter(shopId, user.userId, body.name, body.entity, body.filters)
  }

  @Delete('filters/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFilter(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    await this.searchService.deleteFilter(shopId, user.userId, id)
  }
}

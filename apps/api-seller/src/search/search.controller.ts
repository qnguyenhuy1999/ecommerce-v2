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
import type { ShopService } from '../shop/shop.service'
import type { SearchService } from './search.service'
import type { ProductSearchDto, OrderSearchDto } from './dto/search-query.dto'

@ApiTags('Seller/Search')
@ApiAuth()
@ApiErrorResponses()
@Controller('search')
@UseGuards(AuthGuard)
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly shopService: ShopService,
  ) {}

  @Get('products')
  @ApiPaginatedResponse(Object)
  async searchProducts(@CurrentUser() user: SessionData, @Query() query: ProductSearchDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.searchService.searchProducts(shopId, query)
  }

  @Get('orders')
  @ApiPaginatedResponse(Object)
  async searchOrders(@CurrentUser() user: SessionData, @Query() query: OrderSearchDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.searchService.searchOrders(shopId, query)
  }

  @Get('filters')
  @ApiOkResponseData(Object)
  async listFilters(@CurrentUser() user: SessionData, @Query('entity') entity?: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.searchService.listSavedFilters(shopId, user.userId, entity)
  }

  @Post('filters')
  @ApiCreatedResponseData(Object)
  async saveFilter(
    @CurrentUser() user: SessionData,
    @Body() body: { name: string; entity: string; filters: Record<string, unknown> },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.searchService.saveFilter(shopId, user.userId, body.name, body.entity, body.filters)
  }

  @Delete('filters/:id')
  @ApiOkResponseData(Object)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFilter(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    await this.searchService.deleteFilter(shopId, user.userId, id)
  }
}

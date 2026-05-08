import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { AdvancedSearchService } from './advanced-search.service'
import { SearchProductsDto, SearchSuggestionsDto } from './dto/search.dto'

@Controller('search')
@UseGuards(AuthGuard)
export class AdvancedSearchController {
  constructor(
    private readonly searchService: AdvancedSearchService,
    private readonly shopService: ShopService,
  ) {}

  @Get('products')
  async searchProducts(@Query() dto: SearchProductsDto) {
    return this.searchService.searchProducts(dto)
  }

  @Get('suggestions')
  async getSuggestions(@Query() dto: SearchSuggestionsDto) {
    return this.searchService.getSuggestions(dto)
  }

  @Get('popular')
  async getPopularSearches() {
    return this.searchService.getPopularSearches()
  }

  @Get('analytics')
  async getSearchAnalytics(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.searchService.getSearchAnalytics(shopId)
  }
}

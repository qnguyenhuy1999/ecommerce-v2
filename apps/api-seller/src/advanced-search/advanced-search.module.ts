import { Module } from '@nestjs/common'
import { AdvancedSearchController } from './advanced-search.controller'
import { AdvancedSearchService } from './advanced-search.service'
import { AuthModule } from '../auth/auth.module'
import { ShopModule } from '../shop/shop.module'

@Module({
  imports: [AuthModule, ShopModule],
  controllers: [AdvancedSearchController],
  providers: [AdvancedSearchService],
  exports: [AdvancedSearchService],
})
export class AdvancedSearchModule {}

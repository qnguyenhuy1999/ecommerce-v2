import { Module } from '@nestjs/common'
import { RecommendationController } from './recommendation.controller'
import { RecommendationService } from './recommendation.service'
import { AuthModule } from '../auth/auth.module'
import { ShopModule } from '../shop/shop.module'

@Module({
  imports: [AuthModule, ShopModule],
  controllers: [RecommendationController],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}

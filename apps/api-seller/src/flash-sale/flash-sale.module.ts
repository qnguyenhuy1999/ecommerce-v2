import { Module } from '@nestjs/common'
import { FlashSaleController } from './flash-sale.controller'
import { FlashSaleService } from './flash-sale.service'
import { AuthModule } from '../auth/auth.module'
import { ShopModule } from '../shop/shop.module'

@Module({
  imports: [AuthModule, ShopModule],
  controllers: [FlashSaleController],
  providers: [FlashSaleService],
  exports: [FlashSaleService],
})
export class FlashSaleModule {}

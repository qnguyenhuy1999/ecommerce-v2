import { Module } from '@nestjs/common'
import { ShippingController } from './shipping.controller'
import { ShippingService } from './shipping.service'
import { AuthModule } from '../auth/auth.module'
import { ShopModule } from '../shop/shop.module'

@Module({
  imports: [AuthModule, ShopModule],
  controllers: [ShippingController],
  providers: [ShippingService],
  exports: [ShippingService],
})
export class ShippingModule {}

import { Module } from '@nestjs/common'
import { WarehouseController } from './warehouse.controller'
import { WarehouseService } from './warehouse.service'
import { AuthModule } from '../auth/auth.module'
import { ShopModule } from '../shop/shop.module'

@Module({
  imports: [AuthModule, ShopModule],
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
export class WarehouseModule {}

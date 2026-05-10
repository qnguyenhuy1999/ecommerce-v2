import { Module } from '@nestjs/common'
import { InventoryController } from './inventory.controller'
import { InventoryService } from './inventory.service'
import { InventoryRepository } from './repositories/inventory.repository'
import { AuthModule } from '../auth/auth.module'
import { ShopModule } from '../shop/shop.module'

@Module({
  imports: [AuthModule, ShopModule],
  controllers: [InventoryController],
  providers: [InventoryRepository, InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}

import { Module } from '@nestjs/common'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { OrderRepository } from './repositories/order.repository'
import { AuthModule } from '../auth/auth.module'
import { ShopModule } from '../shop/shop.module'

@Module({
  imports: [AuthModule, ShopModule],
  controllers: [OrderController],
  providers: [OrderRepository, OrderService],
  exports: [OrderService],
})
export class OrderModule {}

import { Module } from '@nestjs/common'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { ProductRepository } from './repositories/product.repository'
import { AuthModule } from '../auth/auth.module'
import { ShopModule } from '../shop/shop.module'

@Module({
  imports: [AuthModule, ShopModule],
  controllers: [ProductController],
  providers: [ProductRepository, ProductService],
  exports: [ProductService],
})
export class ProductModule {}

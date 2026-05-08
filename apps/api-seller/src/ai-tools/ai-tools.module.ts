import { Module } from '@nestjs/common'
import { AiToolsController } from './ai-tools.controller'
import { AiToolsService } from './ai-tools.service'
import { AuthModule } from '../auth/auth.module'
import { ShopModule } from '../shop/shop.module'

@Module({
  imports: [AuthModule, ShopModule],
  controllers: [AiToolsController],
  providers: [AiToolsService],
  exports: [AiToolsService],
})
export class AiToolsModule {}

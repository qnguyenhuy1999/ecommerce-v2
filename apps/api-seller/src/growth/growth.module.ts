import { Module } from '@nestjs/common'
import { GrowthController } from './growth.controller'
import { GrowthService } from './growth.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [GrowthController],
  providers: [GrowthService],
  exports: [GrowthService],
})
export class GrowthModule {}

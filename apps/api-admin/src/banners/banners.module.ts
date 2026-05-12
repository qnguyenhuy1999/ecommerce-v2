import { Module } from '@nestjs/common'
import { BannersController } from './banners.controller'
import { BannersService } from './banners.service'
import { AuditLogsModule } from '../audit-logs/audit-logs.module'

@Module({
  imports: [AuditLogsModule],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}

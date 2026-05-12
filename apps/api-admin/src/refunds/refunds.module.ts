import { Module } from '@nestjs/common'
import { RefundsController } from './refunds.controller'
import { RefundsService } from './refunds.service'
import { AuditLogsModule } from '../audit-logs/audit-logs.module'

@Module({
  imports: [AuditLogsModule],
  controllers: [RefundsController],
  providers: [RefundsService],
})
export class RefundsModule {}

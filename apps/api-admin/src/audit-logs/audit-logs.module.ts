import { Module, forwardRef } from '@nestjs/common';
import { AuditLogsController } from './audit-logs.controller';
import { AuditLogService } from './audit-log.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [AuditLogsController],
  providers: [AuditLogService],
  exports: [AuditLogService],
})
export class AuditLogsModule {}

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import type { AuditActionType } from '@ecom/database';

@Controller('audit-logs')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class AuditLogsController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @Permissions('AUDIT_VIEW')
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('action') action?: AuditActionType,
    @Query('adminId') adminId?: string,
  ) {
    const result = await this.auditLogService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
      action,
      adminId,
    });
    return { success: true, data: result };
  }
}

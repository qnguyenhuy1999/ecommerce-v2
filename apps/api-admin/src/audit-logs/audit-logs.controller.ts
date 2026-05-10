import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import type { AuditActionType } from '@ecom/database';

@ApiTags("Audit-logs")
@Controller('audit-logs')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class AuditLogsController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get()
  @Permissions('AUDIT_VIEW')
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('action') action?: AuditActionType,
    @Query('adminId') adminId?: string,
  ) {
    const result = await this.auditLogService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      action,
      adminId,
    });
    return result;
  }
}

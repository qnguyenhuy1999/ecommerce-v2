import { ApiTags, ApiOperation, ApiExtraModels } from '@nestjs/swagger'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import type { AuditLogService } from './audit-log.service'
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'
import { PermissionGuard } from '../auth/guards/permission.guard'
import { Permissions } from '../auth/decorators/permissions.decorator'
import type { AuditLogQueryDto } from './dto/audit-log-query.dto'
import { AuditLogResponseDto } from './dto/audit-log-query.dto'
import { ApiPaginatedResponse, ApiErrorResponses, ApiAuth } from '@ecom/nestjs-core/openapi'

@ApiTags('Admin/Audit-logs')
@Controller('audit-logs')
@UseGuards(AdminAuthGuard, PermissionGuard)
@ApiAuth()
@ApiErrorResponses()
@ApiExtraModels(AuditLogResponseDto)
export class AuditLogsController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @ApiOperation({ summary: 'List all audit logs' })
  @ApiPaginatedResponse(AuditLogResponseDto)
  @Get()
  @Permissions('AUDIT_VIEW')
  async findAll(@Query() query: AuditLogQueryDto) {
    const result = await this.auditLogService.findAll({
      page: query.page,
      limit: query.limit,
      action: query.action,
      adminId: query.adminId,
    })
    return result
  }
}

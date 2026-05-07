import {
  Controller, Get, Post, Param, Query, Body, UseGuards, Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { UserQueryDto, UserActionDto } from './dto/user-query.dto';
import { AuditActionType, type UserStatus } from '@ecom/database';

@Controller('users')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  @Permissions('USER_VIEW')
  async findAll(@Query() query: UserQueryDto) {
    const result = await this.usersService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize, 10) : undefined,
      search: query.search,
      status: query.status as UserStatus | undefined,
    });
    return { success: true, data: result };
  }

  @Get('status-counts')
  @Permissions('USER_VIEW')
  async statusCounts() {
    const counts = await this.usersService.getStatusCounts();
    return { success: true, data: counts };
  }

  @Get(':id')
  @Permissions('USER_VIEW')
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return { success: true, data: user };
  }

  @Post(':id/suspend')
  @Permissions('USER_MANAGE')
  async suspend(
    @Param('id') id: string,
    @Body() dto: UserActionDto,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const user = await this.usersService.suspend(id);
    await this.auditLogService.log({
      adminId: admin.adminId, action: AuditActionType.USER_SUSPENDED,
      entityType: 'User', entityId: id,
      metadata: { reason: dto.reason }, ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: user };
  }

  @Post(':id/ban')
  @Permissions('USER_MANAGE')
  async ban(
    @Param('id') id: string,
    @Body() dto: UserActionDto,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const user = await this.usersService.ban(id);
    await this.auditLogService.log({
      adminId: admin.adminId, action: AuditActionType.USER_BANNED,
      entityType: 'User', entityId: id,
      metadata: { reason: dto.reason }, ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: user };
  }

  @Post(':id/activate')
  @Permissions('USER_MANAGE')
  async activate(
    @Param('id') id: string,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const user = await this.usersService.activate(id);
    await this.auditLogService.log({
      adminId: admin.adminId, action: AuditActionType.USER_ACTIVATED,
      entityType: 'User', entityId: id,
      metadata: { action: 'reactivate' }, ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: user };
  }
}

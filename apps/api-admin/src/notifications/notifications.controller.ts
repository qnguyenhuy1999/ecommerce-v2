import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Controller, Get, Post, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator';
import { AuditLog } from '../common/decorators/audit-log.decorator';
import { NotificationQueryDto, CreateNotificationDto, CreateTemplateDto } from './dto/notification.dto';
import type { AdminNotificationStatus, NotificationChannel } from '@ecom/database';

@ApiTags("Notifications")
@Controller('notifications')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get()
  @Permissions('NOTIFICATION_MANAGE')
  async findAll(@Query() query: NotificationQueryDto) {
    const result = await this.notificationsService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize, 10) : undefined,
      status: query.status as AdminNotificationStatus | undefined,
    });
    return result;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get('templates')
  @Permissions('NOTIFICATION_MANAGE')
  async findTemplates() {
    const templates = await this.notificationsService.findTemplates();
    return templates;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get(':id')
  @Permissions('NOTIFICATION_MANAGE')
  async findById(@Param('id') id: string) {
    const notification = await this.notificationsService.findById(id);
    return notification;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Post()
  @Permissions('NOTIFICATION_MANAGE')
  @AuditLog('NOTIFICATION_CREATED', 'AdminNotification', { entityIdPath: 'data.id' })
  async create(
    @Body() dto: CreateNotificationDto,
    @CurrentAdmin() admin: AdminSessionData,
  ) {
    const notification = await this.notificationsService.create({
      ...dto,
      channel: (dto.channel as NotificationChannel) ?? 'IN_APP',
      sentBy: admin.adminId,
    });
    return notification;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Post(':id/send')
  @Permissions('NOTIFICATION_MANAGE')
  @AuditLog('NOTIFICATION_SENT', 'AdminNotification', { entityIdParam: 'id' })
  async send(
    @Param('id') id: string,
    @CurrentAdmin() admin: AdminSessionData,
  ) {
    const notification = await this.notificationsService.send(id, admin.adminId);
    return notification;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Post('templates')
  @Permissions('NOTIFICATION_MANAGE')
  @AuditLog('NOTIFICATION_TEMPLATE_CREATED', 'NotificationTemplate', { entityIdPath: 'data.id' })
  async createTemplate(@Body() dto: CreateTemplateDto) {
    const template = await this.notificationsService.createTemplate({
      ...dto,
      channel: (dto.channel as NotificationChannel) ?? 'IN_APP',
    });
    return template;
  }
}

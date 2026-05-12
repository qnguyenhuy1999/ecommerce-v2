import { ApiTags, ApiOperation, ApiExtraModels } from '@nestjs/swagger'
import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'
import { PermissionGuard } from '../auth/guards/permission.guard'
import { Permissions } from '../auth/decorators/permissions.decorator'
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator'
import { AuditLog } from '../common/decorators/audit-log.decorator'
import {
  NotificationQueryDto,
  CreateNotificationDto,
  CreateTemplateDto,
} from './dto/notification.dto'
import { NotificationResponseDto, NotificationTemplateResponseDto } from './dto/notification.dto'
import {
  ApiOkResponseData,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-core/openapi'

@ApiTags('Admin/Notifications')
@Controller('notifications')
@UseGuards(AdminAuthGuard, PermissionGuard)
@ApiErrorResponses()
@ApiAuth()
@ApiExtraModels(NotificationResponseDto, NotificationTemplateResponseDto)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'List all admin notifications' })
  @ApiPaginatedResponse(NotificationResponseDto)
  @Get()
  @Permissions('NOTIFICATION_MANAGE')
  async findAll(@Query() query: NotificationQueryDto) {
    const result = await this.notificationsService.findAll({ ...query })
    return result
  }

  @ApiOperation({ summary: 'List all notification templates' })
  @ApiOkResponseData([NotificationTemplateResponseDto])
  @Get('templates')
  @Permissions('NOTIFICATION_MANAGE')
  async findTemplates() {
    const templates = await this.notificationsService.findTemplates()
    return templates
  }

  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiOkResponseData(NotificationResponseDto)
  @Get(':id')
  @Permissions('NOTIFICATION_MANAGE')
  async findById(@Param('id') id: string) {
    const notification = await this.notificationsService.findById(id)
    return notification
  }

  @ApiOperation({ summary: 'Create new admin notification' })
  @ApiOkResponseData(NotificationResponseDto)
  @Post()
  @Permissions('NOTIFICATION_MANAGE')
  @AuditLog('NOTIFICATION_CREATED', 'AdminNotification', { entityIdPath: 'data.id' })
  async create(@Body() dto: CreateNotificationDto, @CurrentAdmin() admin: AdminSessionData) {
    const notification = await this.notificationsService.create({
      ...dto,
      channel: dto.channel ?? 'IN_APP',
      sentBy: admin.adminId,
    })
    return notification
  }

  @ApiOperation({ summary: 'Send notification' })
  @ApiOkResponseData(NotificationResponseDto)
  @Post(':id/send')
  @Permissions('NOTIFICATION_MANAGE')
  @AuditLog('NOTIFICATION_SENT', 'AdminNotification', { entityIdParam: 'id' })
  async send(@Param('id') id: string, @CurrentAdmin() admin: AdminSessionData) {
    const notification = await this.notificationsService.send(id, admin.adminId)
    return notification
  }

  @ApiOperation({ summary: 'Create notification template' })
  @ApiOkResponseData(NotificationTemplateResponseDto)
  @Post('templates')
  @Permissions('NOTIFICATION_MANAGE')
  @AuditLog('NOTIFICATION_TEMPLATE_CREATED', 'NotificationTemplate', { entityIdPath: 'data.id' })
  async createTemplate(@Body() dto: CreateTemplateDto) {
    const template = await this.notificationsService.createTemplate({
      ...dto,
      channel: dto.channel ?? 'IN_APP',
    })
    return template
  }
}

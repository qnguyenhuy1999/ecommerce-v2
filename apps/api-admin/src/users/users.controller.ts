import {
  Controller, Get, Post, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { AuditLog } from '../common/decorators/audit-log.decorator';
import { UserQueryDto, UserActionDto } from './dto/user-query.dto';
import { AuditActionType, type UserStatus } from '@ecom/database';

@Controller('users')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
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
  @AuditLog(AuditActionType.USER_SUSPENDED, 'User', {
    entityIdParam: 'id',
    metadataExtractor: (_result, body) => ({ reason: (body as { reason?: string }).reason }),
  })
  async suspend(
    @Param('id') id: string,
    @Body() _dto: UserActionDto,
  ) {
    const user = await this.usersService.suspend(id);
    return { success: true, data: user };
  }

  @Post(':id/ban')
  @Permissions('USER_MANAGE')
  @AuditLog(AuditActionType.USER_BANNED, 'User', {
    entityIdParam: 'id',
    metadataExtractor: (_result, body) => ({ reason: (body as { reason?: string }).reason }),
  })
  async ban(
    @Param('id') id: string,
    @Body() _dto: UserActionDto,
  ) {
    const user = await this.usersService.ban(id);
    return { success: true, data: user };
  }

  @Post(':id/activate')
  @Permissions('USER_MANAGE')
  @AuditLog(AuditActionType.USER_ACTIVATED, 'User', {
    entityIdParam: 'id',
    metadataExtractor: () => ({ action: 'reactivate' }),
  })
  async activate(
    @Param('id') id: string,
  ) {
    const user = await this.usersService.activate(id);
    return { success: true, data: user };
  }
}

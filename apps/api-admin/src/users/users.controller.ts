import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Controller, Get, Post, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { AuditLog } from '../common/decorators/audit-log.decorator';
import { UserQueryDto, UserActionDto } from './dto/user-query.dto';
import { type UserStatus } from '@ecom/database';
import { AUDIT_ACTIONS } from '@ecom/shared/constants';

@ApiTags("Users")
@Controller('users')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get()
  @Permissions('USER_VIEW')
  async findAll(@Query() query: UserQueryDto) {
    const result = await this.usersService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize, 10) : undefined,
      search: query.search,
      status: query.status as UserStatus | undefined,
    });
    return result;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get('status-counts')
  @Permissions('USER_VIEW')
  async statusCounts() {
    const counts = await this.usersService.getStatusCounts();
    return counts;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get(':id')
  @Permissions('USER_VIEW')
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return user;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Post(':id/suspend')
  @Permissions('USER_MANAGE')
  @AuditLog(AUDIT_ACTIONS.USER_SUSPENDED, 'User', {
    entityIdParam: 'id',
    metadataExtractor: (_result, body) => ({ reason: (body as { reason?: string }).reason }),
  })
  async suspend(
    @Param('id') id: string,
    @Body() _dto: UserActionDto,
  ) {
    const user = await this.usersService.suspend(id);
    return user;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Post(':id/ban')
  @Permissions('USER_MANAGE')
  @AuditLog(AUDIT_ACTIONS.USER_BANNED, 'User', {
    entityIdParam: 'id',
    metadataExtractor: (_result, body) => ({ reason: (body as { reason?: string }).reason }),
  })
  async ban(
    @Param('id') id: string,
    @Body() _dto: UserActionDto,
  ) {
    const user = await this.usersService.ban(id);
    return user;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Post(':id/activate')
  @Permissions('USER_MANAGE')
  @AuditLog(AUDIT_ACTIONS.USER_ACTIVATED, 'User', {
    entityIdParam: 'id',
    metadataExtractor: () => ({ action: 'reactivate' }),
  })
  async activate(
    @Param('id') id: string,
  ) {
    const user = await this.usersService.activate(id);
    return user;
  }
}

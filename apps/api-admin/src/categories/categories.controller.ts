import {
  Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { CategoriesService } from './categories.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { CategoryQueryDto, CreateCategoryDto, UpdateCategoryDto, ReorderDto } from './dto/category.dto';

@Controller('categories')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  @Permissions('PRODUCT_VIEW')
  async findAll(@Query() query: CategoryQueryDto) {
    const items = await this.categoriesService.findAll(query.parentId);
    return { success: true, data: items };
  }

  @Get(':id')
  @Permissions('PRODUCT_VIEW')
  async findById(@Param('id') id: string) {
    const cat = await this.categoriesService.findById(id);
    return { success: true, data: cat };
  }

  @Get(':id/breadcrumb')
  @Permissions('PRODUCT_VIEW')
  async breadcrumb(@Param('id') id: string) {
    const crumbs = await this.categoriesService.getBreadcrumb(id);
    return { success: true, data: crumbs };
  }

  @Post()
  @Permissions('CATEGORY_MANAGE')
  async create(
    @Body() dto: CreateCategoryDto,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const cat = await this.categoriesService.create(dto);
    await this.auditLogService.log({
      adminId: admin.adminId, action: 'CATEGORY_CREATED',
      entityType: 'Category', entityId: cat.id,
      ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: cat };
  }

  @Put(':id')
  @Permissions('CATEGORY_MANAGE')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const cat = await this.categoriesService.update(id, dto);
    await this.auditLogService.log({
      adminId: admin.adminId, action: 'CATEGORY_UPDATED',
      entityType: 'Category', entityId: id,
      ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: cat };
  }

  @Delete(':id')
  @Permissions('CATEGORY_MANAGE')
  async delete(
    @Param('id') id: string,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    await this.categoriesService.delete(id);
    await this.auditLogService.log({
      adminId: admin.adminId, action: 'CATEGORY_DELETED',
      entityType: 'Category', entityId: id,
      ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true };
  }

  @Post('reorder')
  @Permissions('CATEGORY_MANAGE')
  async reorder(@Body() dto: ReorderDto) {
    await this.categoriesService.reorder(dto.items);
    return { success: true };
  }
}

import { ApiTags, ApiOperation, ApiExtraModels } from '@nestjs/swagger';
import {
  Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { AuditLog } from '../common/decorators/audit-log.decorator';
import { CategoryQueryDto, CreateCategoryDto, UpdateCategoryDto, ReorderDto, CategoryResponseDto } from './dto/category.dto';
import { ApiOkResponseData, ApiErrorResponses, ApiAuth } from '@ecom/nestjs-openapi';

@ApiTags("Admin/Categories")
@Controller('categories')
@UseGuards(AdminAuthGuard, PermissionGuard)
@ApiAuth()
@ApiErrorResponses()
@ApiExtraModels(CategoryResponseDto)
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  @ApiOperation({ summary: "List all categories" })
  @ApiOkResponseData([CategoryResponseDto])
  @Get()
  @Permissions('PRODUCT_VIEW')
  async findAll(@Query() query: CategoryQueryDto) {
    const items = await this.categoriesService.findAll(query.parentId);
    return items;
  }

  @ApiOperation({ summary: "Get category by ID" })
  @ApiOkResponseData(CategoryResponseDto)
  @Get(':id')
  @Permissions('PRODUCT_VIEW')
  async findById(@Param('id') id: string) {
    const cat = await this.categoriesService.findById(id);
    return cat;
  }

  @ApiOperation({ summary: "Get category breadcrumb" })
  @ApiOkResponseData([CategoryResponseDto])
  @Get(':id/breadcrumb')
  @Permissions('PRODUCT_VIEW')
  async breadcrumb(@Param('id') id: string) {
    const crumbs = await this.categoriesService.getBreadcrumb(id);
    return crumbs;
  }

  @ApiOperation({ summary: "Create category" })
  @ApiOkResponseData(CategoryResponseDto)
  @Post()
  @Permissions('CATEGORY_MANAGE')
  @AuditLog('CATEGORY_CREATED', 'Category', { entityIdPath: 'data.id' })
  async create(
    @Body() dto: CreateCategoryDto,
  ) {
    const cat = await this.categoriesService.create(dto);
    return cat;
  }

  @ApiOperation({ summary: "Update category" })
  @ApiOkResponseData(CategoryResponseDto)
  @Put(':id')
  @Permissions('CATEGORY_MANAGE')
  @AuditLog('CATEGORY_UPDATED', 'Category', { entityIdParam: 'id' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    const cat = await this.categoriesService.update(id, dto);
    return cat;
  }

  @ApiOperation({ summary: "Delete category" })
  @ApiOkResponseData(Object)
  @Delete(':id')
  @Permissions('CATEGORY_MANAGE')
  @AuditLog('CATEGORY_DELETED', 'Category', { entityIdParam: 'id' })
  async delete(
    @Param('id') id: string,
  ) {
    await this.categoriesService.delete(id);
    return { success: true };
  }

  @ApiOperation({ summary: "Reorder categories" })
  @ApiOkResponseData(Object)
  @Post('reorder')
  @Permissions('CATEGORY_MANAGE')
  @AuditLog('CATEGORY_REORDERED', 'Category', {
    metadataExtractor: (_result, body) => ({ count: (body as ReorderDto).items.length }),
  })
  async reorder(@Body() dto: ReorderDto) {
    await this.categoriesService.reorder(dto.items);
    return { success: true };
  }
}

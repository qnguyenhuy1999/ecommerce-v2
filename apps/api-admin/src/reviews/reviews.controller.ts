import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common'
import { ReviewsService } from './reviews.service'
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'
import { PermissionGuard } from '../auth/guards/permission.guard'
import { Permissions } from '../auth/decorators/permissions.decorator'
import { AuditLog } from '../common/decorators/audit-log.decorator'
import { ReviewQueryDto } from './dto/review-query.dto'
import type { ReviewStatus } from '@ecom/database'

@ApiTags("Reviews")
@Controller('reviews')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
  ) {}

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get()
  @Permissions('REVIEW_MODERATE')
  async findAll(@Query() query: ReviewQueryDto) {
    const result = await this.reviewsService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize, 10) : undefined,
      status: query.status as ReviewStatus | undefined,
    })
    return result
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get('status-counts')
  @Permissions('REVIEW_MODERATE')
  async statusCounts() {
    const counts = await this.reviewsService.getStatusCounts()
    return counts
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get(':id')
  @Permissions('REVIEW_MODERATE')
  async findById(@Param('id') id: string) {
    const review = await this.reviewsService.findById(id)
    return review
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Post(':id/approve')
  @Permissions('REVIEW_MODERATE')
  @AuditLog('REVIEW_APPROVED', 'Review', { entityIdParam: 'id' })
  async approve(
    @Param('id') id: string,
  ) {
    const review = await this.reviewsService.approve(id)
    return review
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Post(':id/hide')
  @Permissions('REVIEW_MODERATE')
  @AuditLog('REVIEW_HIDDEN', 'Review', { entityIdParam: 'id' })
  async hide(
    @Param('id') id: string,
  ) {
    const review = await this.reviewsService.hide(id)
    return review
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Post(':id/reject')
  @Permissions('REVIEW_MODERATE')
  @AuditLog('REVIEW_REJECTED', 'Review', { entityIdParam: 'id' })
  async reject(
    @Param('id') id: string,
  ) {
    const review = await this.reviewsService.reject(id)
    return review
  }
}

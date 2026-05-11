import { ApiTags, ApiOperation, ApiExtraModels } from '@nestjs/swagger'
import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common'
import type { ReviewsService } from './reviews.service'
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'
import { PermissionGuard } from '../auth/guards/permission.guard'
import { Permissions } from '../auth/decorators/permissions.decorator'
import { AuditLog } from '../common/decorators/audit-log.decorator'
import type { ReviewQueryDto } from './dto/review-query.dto'
import { ReviewResponseDto } from './dto/review-query.dto'
import {
  ApiOkResponseData,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-core/openapi'

@ApiTags('Admin/Reviews')
@Controller('reviews')
@UseGuards(AdminAuthGuard, PermissionGuard)
@ApiErrorResponses()
@ApiAuth()
@ApiExtraModels(ReviewResponseDto)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'List all reviews' })
  @ApiPaginatedResponse(ReviewResponseDto)
  @Get()
  @Permissions('REVIEW_MODERATE')
  async findAll(@Query() query: ReviewQueryDto) {
    const result = await this.reviewsService.findAll({
      page: query.page,
      limit: query.limit,
      status: query.status,
    })
    return result
  }

  @ApiOperation({ summary: 'Get review status counts' })
  @ApiOkResponseData(Object)
  @Get('status-counts')
  @Permissions('REVIEW_MODERATE')
  async statusCounts() {
    const counts = await this.reviewsService.getStatusCounts()
    return counts
  }

  @ApiOperation({ summary: 'Get review by ID' })
  @ApiOkResponseData(ReviewResponseDto)
  @Get(':id')
  @Permissions('REVIEW_MODERATE')
  async findById(@Param('id') id: string) {
    const review = await this.reviewsService.findById(id)
    return review
  }

  @ApiOperation({ summary: 'Approve review' })
  @ApiOkResponseData(ReviewResponseDto)
  @Post(':id/approve')
  @Permissions('REVIEW_MODERATE')
  @AuditLog('REVIEW_APPROVED', 'Review', { entityIdParam: 'id' })
  async approve(@Param('id') id: string) {
    const review = await this.reviewsService.approve(id)
    return review
  }

  @ApiOperation({ summary: 'Hide review' })
  @ApiOkResponseData(ReviewResponseDto)
  @Post(':id/hide')
  @Permissions('REVIEW_MODERATE')
  @AuditLog('REVIEW_HIDDEN', 'Review', { entityIdParam: 'id' })
  async hide(@Param('id') id: string) {
    const review = await this.reviewsService.hide(id)
    return review
  }

  @ApiOperation({ summary: 'Reject review' })
  @ApiOkResponseData(ReviewResponseDto)
  @Post(':id/reject')
  @Permissions('REVIEW_MODERATE')
  @AuditLog('REVIEW_REJECTED', 'Review', { entityIdParam: 'id' })
  async reject(@Param('id') id: string) {
    const review = await this.reviewsService.reject(id)
    return review
  }
}

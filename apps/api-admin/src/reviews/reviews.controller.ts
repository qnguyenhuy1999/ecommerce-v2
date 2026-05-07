import { Controller, Get, Post, Param, Query, UseGuards, Req } from '@nestjs/common'
import type { Request } from 'express'
import { ReviewsService } from './reviews.service'
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'
import { PermissionGuard } from '../auth/guards/permission.guard'
import { Permissions } from '../auth/decorators/permissions.decorator'
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator'
import { AuditLogService } from '../audit-logs/audit-log.service'
import { ReviewQueryDto } from './dto/review-query.dto'
import type { ReviewStatus } from '@ecom/database'

@Controller('reviews')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  @Permissions('REVIEW_MODERATE')
  async findAll(@Query() query: ReviewQueryDto) {
    const result = await this.reviewsService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize, 10) : undefined,
      status: query.status as ReviewStatus | undefined,
    })
    return { success: true, data: result }
  }

  @Get('status-counts')
  @Permissions('REVIEW_MODERATE')
  async statusCounts() {
    const counts = await this.reviewsService.getStatusCounts()
    return { success: true, data: counts }
  }

  @Get(':id')
  @Permissions('REVIEW_MODERATE')
  async findById(@Param('id') id: string) {
    const review = await this.reviewsService.findById(id)
    return { success: true, data: review }
  }

  @Post(':id/approve')
  @Permissions('REVIEW_MODERATE')
  async approve(
    @Param('id') id: string,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const review = await this.reviewsService.approve(id)
    await this.auditLogService.log({
      adminId: admin.adminId,
      action: 'REVIEW_APPROVED',
      entityType: 'Review',
      entityId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    })
    return { success: true, data: review }
  }

  @Post(':id/hide')
  @Permissions('REVIEW_MODERATE')
  async hide(
    @Param('id') id: string,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const review = await this.reviewsService.hide(id)
    await this.auditLogService.log({
      adminId: admin.adminId,
      action: 'REVIEW_HIDDEN',
      entityType: 'Review',
      entityId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    })
    return { success: true, data: review }
  }

  @Post(':id/reject')
  @Permissions('REVIEW_MODERATE')
  async reject(
    @Param('id') id: string,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const review = await this.reviewsService.reject(id)
    await this.auditLogService.log({
      adminId: admin.adminId,
      action: 'REVIEW_REJECTED',
      entityType: 'Review',
      entityId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    })
    return { success: true, data: review }
  }
}

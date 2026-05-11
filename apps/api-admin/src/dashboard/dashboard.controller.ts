import { ApiTags, ApiOperation, ApiExtraModels } from '@nestjs/swagger'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import type { DashboardService } from './dashboard.service'
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'
import { PermissionGuard } from '../auth/guards/permission.guard'
import { Permissions } from '../auth/decorators/permissions.decorator'
import type { AnalyticsQueryDto} from './dto/dashboard.dto';
import { DashboardMetricsDto, DashboardAnalyticsDto } from './dto/dashboard.dto'
import { ApiOkResponseData, ApiErrorResponses, ApiAuth } from '@ecom/nestjs-core/openapi'

@ApiTags('Admin/Dashboard')
@Controller('dashboard')
@UseGuards(AdminAuthGuard, PermissionGuard)
@ApiErrorResponses()
@ApiAuth()
@ApiExtraModels(DashboardMetricsDto, DashboardAnalyticsDto)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Get dashboard metrics' })
  @ApiOkResponseData(DashboardMetricsDto)
  @Get('metrics')
  @Permissions('DASHBOARD_VIEW')
  async getMetrics() {
    const metrics = await this.dashboardService.getMetrics()
    return metrics
  }

  @ApiOperation({ summary: 'Get dashboard analytics' })
  @ApiOkResponseData(DashboardAnalyticsDto)
  @Get('analytics')
  @Permissions('DASHBOARD_VIEW')
  async getAnalytics(@Query() query: AnalyticsQueryDto) {
    const analytics = await this.dashboardService.getAnalytics(query.period)
    return analytics
  }
}

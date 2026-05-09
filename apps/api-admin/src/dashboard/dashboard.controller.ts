import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags("Dashboard")
@Controller('dashboard')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get('metrics')
  @Permissions('DASHBOARD_VIEW')
  async getMetrics() {
    const metrics = await this.dashboardService.getMetrics();
    return metrics;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get('analytics')
  @Permissions('DASHBOARD_VIEW')
  async getAnalytics(@Query('period') period?: string) {
    const analytics = await this.dashboardService.getAnalytics(period);
    return analytics;
  }
}

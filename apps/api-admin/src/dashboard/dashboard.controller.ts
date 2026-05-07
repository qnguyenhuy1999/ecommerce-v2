import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('dashboard')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  @Permissions('DASHBOARD_VIEW')
  async getMetrics() {
    const metrics = await this.dashboardService.getMetrics();
    return { success: true, data: metrics };
  }

  @Get('analytics')
  @Permissions('DASHBOARD_VIEW')
  async getAnalytics(@Query('period') period?: string) {
    const analytics = await this.dashboardService.getAnalytics(period);
    return { success: true, data: analytics };
  }
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DashboardMetricsDto {
  @ApiProperty() totalSellers!: number;
  @ApiProperty() activeSellers!: number;
  @ApiProperty() pendingSellers!: number;
  @ApiProperty() totalUsers!: number;
  @ApiProperty() totalOrders!: number;
  @ApiProperty() totalProducts!: number;
  @ApiProperty() pendingRefunds!: number;
  @ApiProperty() totalReviews!: number;
  @ApiProperty({ type: 'array', items: { type: 'object' } })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentSellers!: any[];
}

export class AnalyticsQueryDto {
  @ApiPropertyOptional({ example: '30d' })
  @IsOptional() @IsString() period?: string;
}

export class DashboardAnalyticsDto {
  @ApiProperty({ type: 'array', items: { type: 'object' } })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ordersByStatus!: any[];
  @ApiProperty({ type: 'array', items: { type: 'object' } })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  topCategories!: any[];
}

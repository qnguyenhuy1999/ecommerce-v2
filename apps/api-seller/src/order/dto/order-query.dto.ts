import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { OrderStatus } from '@ecom/contracts'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

export class OrderQueryDto extends OffsetPaginationDto {
  @ApiPropertyOptional({ enum: OrderStatus, description: 'Filter by order status' })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus

  @ApiPropertyOptional({ description: 'Search by order number or customer name' })
  @IsOptional()
  @IsString()
  search?: string
}

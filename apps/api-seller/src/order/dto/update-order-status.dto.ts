import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { OrderStatus } from '@ecom/contracts'

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, description: 'New order status' })
  @IsEnum(OrderStatus)
  status!: OrderStatus

  @ApiPropertyOptional({ description: 'Optional note for the status change' })
  @IsOptional()
  @IsString()
  note?: string
}

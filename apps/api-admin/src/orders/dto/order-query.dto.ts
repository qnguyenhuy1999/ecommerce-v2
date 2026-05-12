import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { OrderStatus } from '@ecom/contracts/enums'

export class OrderQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buyerId?: string
}

export class OrderActionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string
}

export class OrderResponseDto {
  @ApiProperty() id!: string
  @ApiProperty() orderNumber!: string
  @ApiProperty() totalAmount!: number
  @ApiProperty({ enum: OrderStatus }) status!: OrderStatus
  @ApiProperty() buyerId!: string
  @ApiProperty() createdAt!: Date
  @ApiProperty() updatedAt!: Date
}

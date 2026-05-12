import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ReturnStatus } from '@ecom/contracts/enums'

export class RefundQueryDto {
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

  @ApiPropertyOptional({ enum: ReturnStatus })
  @IsOptional()
  @IsEnum(ReturnStatus)
  status?: ReturnStatus
}

export class RefundActionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string
}

export class RefundResponseDto {
  @ApiProperty() id!: string
  @ApiProperty() orderId!: string
  @ApiProperty() sellerId!: string
  @ApiProperty() userId!: string
  @ApiProperty({ enum: ReturnStatus }) status!: ReturnStatus
  @ApiProperty() reason!: string
  @ApiPropertyOptional() note?: string
  @ApiProperty() amount!: number
  @ApiProperty() createdAt!: Date
  @ApiProperty() updatedAt!: Date
}

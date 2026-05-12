import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ReviewStatus } from '@ecom/contracts/enums'

export class ReviewQueryDto {
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

  @ApiPropertyOptional({ enum: ReviewStatus })
  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus
}

export class ReviewActionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string
}

export class ReviewResponseDto {
  @ApiProperty() id!: string
  @ApiProperty() productId!: string
  @ApiProperty() userId!: string
  @ApiProperty() rating!: number
  @ApiPropertyOptional() comment?: string
  @ApiProperty({ enum: ReviewStatus }) status!: ReviewStatus
  @ApiProperty() createdAt!: Date
  @ApiProperty() updatedAt!: Date
}

import { IsOptional, IsString, IsEnum } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

export class CouponQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(['DRAFT', 'ACTIVE', 'PAUSED', 'EXPIRED', 'DEPLETED'])
  status?: string

  @IsOptional()
  @IsEnum(['PERCENTAGE', 'FIXED_AMOUNT'])
  type?: string
}

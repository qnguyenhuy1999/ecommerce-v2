import { IsOptional, IsString, IsEnum } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'
import { CouponStatus, CouponType } from '@ecom/database'

export class CouponQueryDto extends OffsetPaginationDto {
  @ApiPropertyOptional({ description: 'Search by coupon code or name' })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ enum: CouponStatus, description: 'Filter by coupon status' })
  @IsOptional()
  @IsEnum(CouponStatus)
  status?: CouponStatus

  @ApiPropertyOptional({ enum: CouponType, description: 'Filter by coupon type' })
  @IsOptional()
  @IsEnum(CouponType)
  type?: CouponType
}

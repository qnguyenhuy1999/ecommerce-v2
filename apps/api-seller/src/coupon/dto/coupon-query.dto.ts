import { IsOptional, IsString, IsEnum } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'
import { CouponStatus, CouponType } from '@ecom/contracts'

export class CouponQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(CouponStatus)
  status?: CouponStatus

  @IsOptional()
  @IsEnum(CouponType)
  type?: CouponType
}

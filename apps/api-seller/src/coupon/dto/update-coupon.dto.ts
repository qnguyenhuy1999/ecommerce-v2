import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator'
import { Type } from 'class-transformer'
import { CouponStatus, CouponType } from '@ecom/database'
import { CouponScope } from './create-coupon.dto'

export class UpdateCouponDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsEnum(CouponType)
  type?: CouponType

  @IsOptional()
  @IsEnum(CouponScope)
  scope?: CouponScope

  @IsOptional()
  @IsEnum(CouponStatus)
  status?: CouponStatus

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountValue?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minOrderAmount?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  usageLimit?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  usageLimitPerUser?: number

  @IsOptional()
  @IsBoolean()
  autoApply?: boolean

  @IsOptional()
  @IsDateString()
  startsAt?: string

  @IsOptional()
  @IsDateString()
  expiresAt?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[]
}

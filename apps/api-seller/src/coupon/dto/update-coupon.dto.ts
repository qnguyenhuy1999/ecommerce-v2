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
import { ApiPropertyOptional } from '@nestjs/swagger'
import { CouponStatus, CouponType } from '@ecom/database'
import { CouponScope } from './create-coupon.dto'

export class UpdateCouponDto {
  @ApiPropertyOptional({ description: 'Coupon display name', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string

  @ApiPropertyOptional({ description: 'Coupon description' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ enum: CouponType, description: 'Discount type' })
  @IsOptional()
  @IsEnum(CouponType)
  type?: CouponType

  @ApiPropertyOptional({ enum: CouponScope, description: 'Coupon applicability scope' })
  @IsOptional()
  @IsEnum(CouponScope)
  scope?: CouponScope

  @ApiPropertyOptional({ enum: CouponStatus, description: 'Coupon status' })
  @IsOptional()
  @IsEnum(CouponStatus)
  status?: CouponStatus

  @ApiPropertyOptional({ description: 'Discount value', minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountValue?: number

  @ApiPropertyOptional({ description: 'Maximum discount amount', minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number

  @ApiPropertyOptional({ description: 'Minimum order amount', minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minOrderAmount?: number

  @ApiPropertyOptional({ description: 'Total usage limit', minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  usageLimit?: number

  @ApiPropertyOptional({ description: 'Usage limit per user', minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  usageLimitPerUser?: number

  @ApiPropertyOptional({ description: 'Whether coupon is auto-applied' })
  @IsOptional()
  @IsBoolean()
  autoApply?: boolean

  @ApiPropertyOptional({ description: 'Coupon start date (ISO 8601)', format: 'date-time' })
  @IsOptional()
  @IsDateString()
  startsAt?: string

  @ApiPropertyOptional({ description: 'Coupon expiration date (ISO 8601)', format: 'date-time' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string

  @ApiPropertyOptional({ description: 'Product IDs for SPECIFIC_PRODUCTS scope', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[]

  @ApiPropertyOptional({ description: 'Category IDs for SPECIFIC_CATEGORIES scope', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[]
}

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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CouponType, CouponScope } from '@ecom/database'

export class CreateCouponDto {
  @ApiProperty({ description: 'Unique coupon code', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  code!: string

  @ApiProperty({ description: 'Coupon display name', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  name!: string

  @ApiPropertyOptional({ description: 'Coupon description' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ enum: CouponType, description: 'Discount type' })
  @IsEnum(CouponType)
  type!: CouponType

  @ApiPropertyOptional({ enum: CouponScope, description: 'Coupon applicability scope' })
  @IsOptional()
  @IsEnum(CouponScope)
  scope?: CouponScope

  @ApiProperty({ description: 'Discount value (percentage or fixed amount)', minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountValue!: number

  @ApiPropertyOptional({
    description: 'Maximum discount amount (for percentage coupons)',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number

  @ApiPropertyOptional({ description: 'Minimum order amount to apply coupon', minimum: 0 })
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

  @ApiPropertyOptional({
    description: 'Whether coupon is auto-applied at checkout',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  autoApply?: boolean

  @ApiProperty({ description: 'Coupon start date (ISO 8601)', format: 'date-time' })
  @IsDateString()
  startsAt!: string

  @ApiProperty({ description: 'Coupon expiration date (ISO 8601)', format: 'date-time' })
  @IsDateString()
  expiresAt!: string

  @ApiPropertyOptional({ description: 'Product IDs for SPECIFIC_PRODUCTS scope', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[]

  @ApiPropertyOptional({
    description: 'Category IDs for SPECIFIC_CATEGORIES scope',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[]
}

// Re-export CouponType for convenience in the module
export { CouponType }

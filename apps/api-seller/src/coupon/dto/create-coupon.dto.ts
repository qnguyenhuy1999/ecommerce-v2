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
import { CouponType } from '@ecom/database'

/** Coupon scope — mirrors the Prisma CouponScope enum. */
export enum CouponScope {
  ALL_PRODUCTS = 'ALL_PRODUCTS',
  SPECIFIC_PRODUCTS = 'SPECIFIC_PRODUCTS',
  SPECIFIC_CATEGORIES = 'SPECIFIC_CATEGORIES',
}

export class CreateCouponDto {
  @IsString()
  @MaxLength(50)
  code!: string

  @IsString()
  @MaxLength(200)
  name!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsEnum(CouponType)
  type!: CouponType

  @IsOptional()
  @IsEnum(CouponScope)
  scope?: CouponScope

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountValue!: number

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

  @IsDateString()
  startsAt!: string

  @IsDateString()
  expiresAt!: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[]
}

// Re-export CouponType for convenience in the module
export { CouponType }

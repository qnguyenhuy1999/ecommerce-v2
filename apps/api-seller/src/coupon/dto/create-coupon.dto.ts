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

  @IsEnum(['PERCENTAGE', 'FIXED_AMOUNT'])
  type!: 'PERCENTAGE' | 'FIXED_AMOUNT'

  @IsOptional()
  @IsEnum(['ALL_PRODUCTS', 'SPECIFIC_PRODUCTS', 'SPECIFIC_CATEGORIES'])
  scope?: 'ALL_PRODUCTS' | 'SPECIFIC_PRODUCTS' | 'SPECIFIC_CATEGORIES'

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

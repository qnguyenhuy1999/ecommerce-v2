import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class VariantOptionValueDto {
  @IsString()
  value!: string
}

export class VariantOptionGroupDto {
  @IsString()
  name!: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantOptionValueDto)
  options!: VariantOptionValueDto[]
}

export class ProductVariantDto {
  @IsOptional()
  @IsString()
  sku?: string

  @IsNumber()
  @Min(0)
  price!: number

  @IsNumber()
  @Min(0)
  stock!: number

  @IsArray()
  @IsString({ each: true })
  optionValues!: string[]
}

export class ProductImageDto {
  @IsString()
  url!: string

  @IsOptional()
  @IsString()
  alt?: string

  @IsOptional()
  @IsBoolean()
  isCover?: boolean
}

export class CreateProductDto {
  @IsString()
  @MaxLength(200)
  name!: string

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string

  @IsOptional()
  @IsUUID()
  categoryId?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number

  @IsOptional()
  @IsString()
  baseSku?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  baseStock?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number

  @IsOptional()
  @IsBoolean()
  hasVariants?: boolean

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantOptionGroupDto)
  variantOptionGroups?: VariantOptionGroupDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[]

  @IsOptional()
  @IsString()
  status?: string
}

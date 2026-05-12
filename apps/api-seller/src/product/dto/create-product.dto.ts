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
  IsEnum,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ProductStatus } from '@ecom/contracts'

export class VariantOptionValueDto {
  @ApiProperty({ description: 'Option value (e.g. "Red", "XL")' })
  @IsString()
  value!: string
}

export class VariantOptionGroupDto {
  @ApiProperty({ description: 'Option group name (e.g. "Color", "Size")' })
  @IsString()
  name!: string

  @ApiProperty({ description: 'Available option values', type: [VariantOptionValueDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantOptionValueDto)
  options!: VariantOptionValueDto[]
}

export class ProductVariantDto {
  @ApiPropertyOptional({ description: 'SKU for this variant' })
  @IsOptional()
  @IsString()
  sku?: string

  @ApiProperty({ description: 'Variant price', minimum: 0 })
  @IsNumber()
  @Min(0)
  price!: number

  @ApiProperty({ description: 'Variant stock quantity', minimum: 0 })
  @IsNumber()
  @Min(0)
  stock!: number

  @ApiProperty({ description: 'Selected option values for this variant', type: [String] })
  @IsArray()
  @IsString({ each: true })
  optionValues!: string[]
}

export class ProductImageDto {
  @ApiProperty({ description: 'Image URL' })
  @IsString()
  url!: string

  @ApiPropertyOptional({ description: 'Alt text for the image' })
  @IsOptional()
  @IsString()
  alt?: string

  @ApiPropertyOptional({ description: 'Whether this is the cover image', default: false })
  @IsOptional()
  @IsBoolean()
  isCover?: boolean
}

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  name!: string

  @ApiPropertyOptional({ description: 'Product description', maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string

  @ApiPropertyOptional({ description: 'Category ID (UUID)', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  categoryId?: string

  @ApiPropertyOptional({ description: 'Base price', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number

  @ApiPropertyOptional({ description: 'Base SKU' })
  @IsOptional()
  @IsString()
  baseSku?: string

  @ApiPropertyOptional({ description: 'Base stock quantity', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  baseStock?: number

  @ApiPropertyOptional({ description: 'Product weight in grams', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number

  @ApiPropertyOptional({ description: 'Whether product has variants', default: false })
  @IsOptional()
  @IsBoolean()
  hasVariants?: boolean

  @ApiPropertyOptional({ description: 'Variant option groups', type: [VariantOptionGroupDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantOptionGroupDto)
  variantOptionGroups?: VariantOptionGroupDto[]

  @ApiPropertyOptional({ description: 'Product variants', type: [ProductVariantDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[]

  @ApiPropertyOptional({ description: 'Product images', type: [ProductImageDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[]

  @ApiPropertyOptional({ enum: ProductStatus, default: ProductStatus.DRAFT, description: 'Initial product status' })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus
}

import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
  MaxLength,
  Min,
  IsEnum,
} from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ProductStatus } from '@ecom/contracts'

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Product name', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string

  @ApiPropertyOptional({ description: 'Product description', maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string

  @ApiPropertyOptional({ description: 'Category ID', format: 'uuid' })
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

  @ApiPropertyOptional({ description: 'Whether product has variants' })
  @IsOptional()
  @IsBoolean()
  hasVariants?: boolean

  @ApiPropertyOptional({ enum: ProductStatus, description: 'Product status' })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus
}

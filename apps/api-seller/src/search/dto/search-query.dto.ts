import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { OffsetPaginationDto } from '@ecom/pagination'

export class ProductSearchDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  q?: string

  @IsOptional()
  @IsString()
  sku?: string

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: string

  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minStock?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxStock?: number

  @IsOptional()
  @IsString()
  sortBy?: string
}

export class SaveFilterDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  entity?: string
}

export class OrderSearchDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  q?: string

  @IsOptional()
  @IsEnum(['PENDING', 'CONFIRMED', 'PACKING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  status?: string

  @IsOptional()
  @IsString()
  startDate?: string

  @IsOptional()
  @IsString()
  endDate?: string
}

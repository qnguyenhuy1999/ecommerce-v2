import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { ProductStatus } from '@ecom/database'

export class ProductQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shopId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string
}

export class ProductResponseDto {
  @ApiProperty({ description: 'Product ID' }) id!: string
  @ApiProperty({ description: 'Product name' }) name!: string
  @ApiProperty({ description: 'URL-friendly slug' }) slug!: string
  @ApiProperty({ description: 'Product description' }) description!: string
  @ApiProperty({ description: 'Base price' }) price!: number
  @ApiProperty({ description: 'Product status', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'REJECTED'] }) status!: string
  @ApiProperty({ description: 'Creation timestamp', format: 'date-time' }) createdAt!: Date
  @ApiProperty({ description: 'Last update timestamp', format: 'date-time' }) updatedAt!: Date
}

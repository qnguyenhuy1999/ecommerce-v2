import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'
import { ProductStatus } from '@ecom/contracts'

export class ProductQueryDto extends OffsetPaginationDto {
  @ApiPropertyOptional({ description: 'Search by product name or SKU' })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ enum: ProductStatus, description: 'Filter by product status' })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus

  @ApiPropertyOptional({ description: 'Filter by category ID', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  categoryId?: string
}

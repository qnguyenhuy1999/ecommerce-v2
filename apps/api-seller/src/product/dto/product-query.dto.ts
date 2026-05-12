import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'
import { ProductStatus } from '@ecom/contracts'

export class ProductQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus

  @IsOptional()
  @IsUUID()
  categoryId?: string
}

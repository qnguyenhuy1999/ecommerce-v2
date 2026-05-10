import { IsOptional, IsString, IsUUID } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/shared/pagination/core'

export class ProductQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  status?: string

  @IsOptional()
  @IsUUID()
  categoryId?: string
}

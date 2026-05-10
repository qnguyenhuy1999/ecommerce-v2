import { IsOptional, IsString } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/shared/pagination/core'

export class OrderQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  status?: string

  @IsOptional()
  @IsString()
  search?: string
}

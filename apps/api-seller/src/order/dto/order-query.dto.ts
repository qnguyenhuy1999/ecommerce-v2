import { IsOptional, IsString } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/pagination'

export class OrderQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  status?: string

  @IsOptional()
  @IsString()
  search?: string
}

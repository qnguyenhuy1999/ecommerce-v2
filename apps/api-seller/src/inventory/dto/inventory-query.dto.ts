import { IsOptional, IsString, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'
import { OffsetPaginationDto } from '@ecom/pagination'

export class InventoryQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  lowStock?: boolean
}

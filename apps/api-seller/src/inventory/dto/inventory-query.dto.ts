import { IsOptional, IsString, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'
import { PaginationDto } from '../../common/dto/pagination.dto'

export class InventoryQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  lowStock?: boolean
}

import { IsOptional, IsString, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'
import { OffsetPaginationDto } from '@ecom/pagination'

export class WarehouseQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean
}

export class StockQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  lowStock?: boolean
}

export class TransferQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  status?: string
}

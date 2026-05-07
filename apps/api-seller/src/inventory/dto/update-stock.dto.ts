import { IsString, IsNumber, IsOptional, IsUUID, Min, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateStockDto {
  @IsUUID()
  variantId!: string

  @IsNumber()
  quantity!: number

  @IsString()
  type!: string

  @IsOptional()
  @IsString()
  note?: string
}

export class BulkUpdateStockDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkStockItemDto)
  items!: BulkStockItemDto[]
}

export class BulkStockItemDto {
  @IsUUID()
  variantId!: string

  @IsNumber()
  @Min(0)
  stock!: number
}

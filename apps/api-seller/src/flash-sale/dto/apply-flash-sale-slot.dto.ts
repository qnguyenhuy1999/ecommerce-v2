import { IsString, IsOptional, IsInt, Min, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class ApplyFlashSaleSlotDto {
  @IsString()
  campaignId!: string

  @IsString()
  productId!: string

  @IsOptional()
  @IsString()
  variantId?: string

  @IsNumber()
  @Type(() => Number)
  salePrice!: number

  @IsInt()
  @Min(1)
  @Type(() => Number)
  totalStock!: number

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  purchaseLimit?: number
}

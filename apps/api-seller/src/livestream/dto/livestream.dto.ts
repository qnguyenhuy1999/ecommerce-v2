import { IsString, IsOptional, IsDateString, IsBoolean, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateLivestreamDto {
  @IsString()
  title!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  thumbnailUrl?: string

  @IsDateString()
  scheduledAt!: string
}

export class AddLivestreamProductDto {
  @IsString()
  productId!: string

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  specialPrice?: number
}

export class PinProductDto {
  @IsString()
  productId!: string

  @IsBoolean()
  isPinned!: boolean
}

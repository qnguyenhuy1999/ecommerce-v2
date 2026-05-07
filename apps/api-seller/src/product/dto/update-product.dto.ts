import { IsString, IsOptional, IsNumber, IsBoolean, IsUUID, MaxLength, Min } from 'class-validator'

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string

  @IsOptional()
  @IsUUID()
  categoryId?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number

  @IsOptional()
  @IsString()
  baseSku?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  baseStock?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number

  @IsOptional()
  @IsBoolean()
  hasVariants?: boolean

  @IsOptional()
  @IsString()
  status?: string
}

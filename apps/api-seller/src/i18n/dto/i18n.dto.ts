import { IsString, IsOptional, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateTranslationDto {
  @IsString()
  entityType!: string

  @IsString()
  entityId!: string

  @IsString()
  field!: string

  @IsString()
  locale!: string

  @IsString()
  value!: string
}

export class CreateCurrencyDto {
  @IsString()
  code!: string

  @IsString()
  name!: string

  @IsString()
  symbol!: string

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  exchangeRate?: number
}

export class CreateRegionDto {
  @IsString()
  code!: string

  @IsString()
  name!: string

  @IsString()
  defaultLocale!: string

  @IsString()
  defaultCurrency!: string

  @IsOptional()
  @IsString()
  timezone?: string

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  taxRate?: number
}

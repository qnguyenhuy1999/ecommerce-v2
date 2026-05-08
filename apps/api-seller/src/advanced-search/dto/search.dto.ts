import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class SearchProductsDto {
  @IsString()
  query!: string

  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number

  @IsOptional()
  @IsString()
  sortBy?: string

  @IsOptional()
  @IsString()
  sortOrder?: string

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number
}

export class SearchSuggestionsDto {
  @IsString()
  query!: string

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number
}

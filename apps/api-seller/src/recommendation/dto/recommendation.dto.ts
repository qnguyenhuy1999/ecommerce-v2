import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'

export class TrackEventDto {
  @IsString()
  eventType!: string

  @IsOptional()
  @IsString()
  productId?: string

  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsString()
  searchQuery?: string

  @IsOptional()
  metadata?: Record<string, unknown>
}

export class GetRecommendationsDto {
  @IsOptional()
  @IsEnum(['similar', 'trending', 'personalized', 'frequently_bought_together', 'recently_viewed'])
  type?: string

  @IsOptional()
  @IsString()
  productId?: string

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number
}

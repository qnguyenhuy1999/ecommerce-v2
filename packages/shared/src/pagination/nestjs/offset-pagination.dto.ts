import { IsOptional, IsInt, Min, Max, IsString, IsIn } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PAGINATION_DEFAULTS } from '../core'

export class OffsetPaginationDto {
  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    minimum: 1,
    default: PAGINATION_DEFAULTS.DEFAULT_PAGE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = PAGINATION_DEFAULTS.DEFAULT_PAGE

  @ApiPropertyOptional({
    description: 'Items per page',
    minimum: 1,
    maximum: PAGINATION_DEFAULTS.MAX_LIMIT,
    default: PAGINATION_DEFAULTS.DEFAULT_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PAGINATION_DEFAULTS.MAX_LIMIT)
  limit?: number = PAGINATION_DEFAULTS.DEFAULT_LIMIT

  /**
   * Deprecated alias for `limit` (kept for backward compatibility).
   * Prefer `limit` in new code.
   */
  @ApiPropertyOptional({
    description: 'Items per page (alias for limit, deprecated)',
    minimum: 1,
    maximum: PAGINATION_DEFAULTS.MAX_LIMIT,
    default: PAGINATION_DEFAULTS.DEFAULT_LIMIT,
    deprecated: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PAGINATION_DEFAULTS.MAX_LIMIT)
  pageSize?: number = PAGINATION_DEFAULTS.DEFAULT_LIMIT

  @ApiPropertyOptional({ description: 'Field to sort by', default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt'

  /**
   * Alias for `sortBy`.
   */
  @ApiPropertyOptional({
    description: 'Field to sort by (alias for sortBy)',
    default: 'createdAt',
    deprecated: true,
  })
  @IsOptional()
  @IsString()
  sort?: string = 'createdAt'

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: ['asc', 'desc'],
    default: PAGINATION_DEFAULTS.DEFAULT_SORT_ORDER,
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = PAGINATION_DEFAULTS.DEFAULT_SORT_ORDER

  /**
   * Alias for `sortOrder`.
   */
  @ApiPropertyOptional({
    description: 'Sort direction (alias for sortOrder)',
    enum: ['asc', 'desc'],
    default: PAGINATION_DEFAULTS.DEFAULT_SORT_ORDER,
    deprecated: true,
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = PAGINATION_DEFAULTS.DEFAULT_SORT_ORDER
}

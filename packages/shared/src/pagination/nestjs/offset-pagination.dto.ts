import { IsOptional, IsInt, Min, Max, IsString, IsIn } from 'class-validator'
import { Type } from 'class-transformer'
import { PAGINATION_DEFAULTS } from '../core'

export class OffsetPaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = PAGINATION_DEFAULTS.DEFAULT_PAGE

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
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PAGINATION_DEFAULTS.MAX_LIMIT)
  pageSize?: number = PAGINATION_DEFAULTS.DEFAULT_LIMIT

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt'

  /**
   * Alias for `sortBy`.
   */
  @IsOptional()
  @IsString()
  sort?: string = 'createdAt'

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = PAGINATION_DEFAULTS.DEFAULT_SORT_ORDER

  /**
   * Alias for `sortOrder`.
   */
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = PAGINATION_DEFAULTS.DEFAULT_SORT_ORDER
}

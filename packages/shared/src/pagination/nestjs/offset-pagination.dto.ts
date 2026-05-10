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

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = PAGINATION_DEFAULTS.DEFAULT_SORT_ORDER
}

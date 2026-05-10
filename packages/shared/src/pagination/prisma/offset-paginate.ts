import { OffsetParams } from '../core';
import { PAGINATION_DEFAULTS, getSkip } from '../core';

export interface OffsetPaginateOptions<T> {
  model: { findMany: (args: unknown) => Promise<T[]>; count: (args: unknown) => Promise<number> };
  where?: unknown;
  include?: unknown;
  select?: unknown;
  orderBy?: unknown;
  params?: OffsetParams;
  page?: number;
  pageSize?: number;
}

export interface OffsetPaginateResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function offsetPaginate<T = unknown>(
  model: { findMany: (args: any) => Promise<T[]>; count: (args: any) => Promise<number> },
  options: Omit<OffsetPaginateOptions<T>, 'model'>
): Promise<OffsetPaginateResult<T>> {
  const {
    where = {},
    include,
    select,
    orderBy,
    params,
    page: explicitPage,
    pageSize,
  } = options;

  const page = Math.max(1, explicitPage ?? params?.page ?? PAGINATION_DEFAULTS.DEFAULT_PAGE);
  const limit = Math.min(
    pageSize ?? params?.limit ?? PAGINATION_DEFAULTS.DEFAULT_LIMIT,
    PAGINATION_DEFAULTS.MAX_LIMIT
  );
  const skip = getSkip(page, limit);

  const effectiveOrderBy = orderBy ?? { createdAt: params?.sortOrder ?? PAGINATION_DEFAULTS.DEFAULT_SORT_ORDER };

  const [items, total] = await Promise.all([
    model.findMany({
      where,
      include,
      select,
      skip,
      take: limit,
      orderBy: effectiveOrderBy,
    }),
    model.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
}

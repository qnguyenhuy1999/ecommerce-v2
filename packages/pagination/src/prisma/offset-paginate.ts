import { buildStableSort } from './stable-sort';

export interface OffsetPaginateOptions<T> {
  page?: number;
  pageSize?: number;
  where?: T;
  include?: unknown;
  select?: unknown;
  orderBy?: unknown;
  stableSort?: boolean; // Default true
}

export interface OffsetPaginateResult<T> {
  items: T[];
  total: number;
}

/**
 * Paginate Prisma queries using offset-based pagination.
 * Automatically adds stable sorting by default to prevent duplicate/missing items.
 *
 * @param model - Prisma model delegate (e.g., prisma.product)
 * @param options - Pagination options
 * @returns Promise with items and total count
 *
 * @example
 * const { items, total } = await offsetPaginate(prisma.product, {
 *   page: 1,
 *   pageSize: 20,
 *   where: { status: 'active' },
 *   orderBy: { createdAt: 'desc' },
 * });
 */
export async function offsetPaginate<
  Model extends { findMany: Function; count: Function },
  WhereInput,
  Result
>(
  model: Model,
  options: OffsetPaginateOptions<WhereInput>
): Promise<OffsetPaginateResult<Result>> {
  const {
    page = 1,
    pageSize = 20,
    where,
    include,
    select,
    stableSort = true,
  } = options;

  const skip = (page - 1) * pageSize;

  let orderBy = options.orderBy;
  if (stableSort && orderBy) {
    orderBy = buildStableSort(orderBy);
  }

  const [items, total] = await Promise.all([
    model.findMany({ where, include, select, orderBy, skip, take: pageSize }),
    model.count({ where }),
  ]);

  return { items, total };
}

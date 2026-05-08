export interface CursorPaginateOptions<T> {
  cursor?: string;
  limit?: number;
  where?: T;
  include?: unknown;
  select?: unknown;
  orderBy?: unknown;
  cursorField?: string; // Default 'id'
}

export interface CursorPaginateResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * Paginate Prisma queries using cursor-based pagination.
 * More efficient than offset pagination for large datasets and high page numbers.
 *
 * @param model - Prisma model delegate (e.g., prisma.product)
 * @param options - Cursor pagination options
 * @returns Promise with items, nextCursor, and hasMore flag
 *
 * @example
 * const { items, nextCursor, hasMore } = await cursorPaginate(prisma.product, {
 *   cursor: 'abc123',
 *   limit: 20,
 *   where: { status: 'active' },
 *   orderBy: { createdAt: 'desc' },
 * });
 */
export async function cursorPaginate<
  Model extends { findMany: Function },
  WhereInput,
  Result
>(
  model: Model,
  options: CursorPaginateOptions<WhereInput>
): Promise<CursorPaginateResult<Result>> {
  const {
    cursor,
    limit = 20,
    where,
    include,
    select,
    orderBy,
    cursorField = 'id',
  } = options;

  const items = await model.findMany({
    where,
    include,
    select,
    orderBy,
    cursor: cursor ? { [cursorField]: cursor } : undefined,
    skip: cursor ? 1 : 0,
    take: limit + 1, // Fetch one extra to check hasMore
  });

  const hasMore = items.length > limit;
  const paginatedItems = hasMore ? items.slice(0, limit) : items;
  const nextCursor =
    hasMore && paginatedItems.length > 0
      ? paginatedItems[paginatedItems.length - 1][cursorField]
      : null;

  return { items: paginatedItems, nextCursor, hasMore };
}

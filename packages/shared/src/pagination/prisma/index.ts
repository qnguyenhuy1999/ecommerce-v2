import 'server-only';

export * from './offset-paginate';
export * from './cursor-paginate';
export * from './stable-sort';

export function buildOffsetResponse<T>(data: T[], page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

import { OffsetParams } from '../core'
import { PAGINATION_DEFAULTS, getSkip } from '../core'

type PaginateModelDelegate = {
  findMany: (args: unknown) => Promise<unknown>
  count: (args: unknown) => Promise<number>
}

type ItemOfModelDelegate<TModel extends PaginateModelDelegate> =
  Awaited<ReturnType<TModel['findMany']>> extends Array<infer TItem> ? TItem : never

export interface OffsetPaginateOptions<T> {
  model: { findMany: (args: unknown) => Promise<T[]>; count: (args: unknown) => Promise<number> }
  where?: unknown
  include?: unknown
  select?: unknown
  orderBy?: unknown
  params?: OffsetParams
  page?: number
  limit?: number
  pageSize?: number
}

export interface OffsetPaginateResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function offsetPaginate<TModel extends PaginateModelDelegate>(
  model: TModel,
  options: Omit<OffsetPaginateOptions<ItemOfModelDelegate<TModel>>, 'model'>,
): Promise<OffsetPaginateResult<ItemOfModelDelegate<TModel>>> {
  const {
    where = {},
    include,
    select,
    orderBy,
    params,
    page: explicitPage,
    limit: explicitLimit,
    pageSize: explicitPageSize,
  } = options

  const page = Math.max(1, explicitPage ?? params?.page ?? PAGINATION_DEFAULTS.DEFAULT_PAGE)
  const limit = Math.min(
    explicitLimit ?? explicitPageSize ?? params?.limit ?? PAGINATION_DEFAULTS.DEFAULT_LIMIT,
    PAGINATION_DEFAULTS.MAX_LIMIT,
  )
  const skip = getSkip(page, limit)

  const effectiveOrderBy = orderBy ?? {
    createdAt: params?.sortOrder ?? PAGINATION_DEFAULTS.DEFAULT_SORT_ORDER,
  }

  const [items, total] = (await Promise.all([
    model.findMany({
      where,
      include,
      select,
      skip,
      take: limit,
      orderBy: effectiveOrderBy,
    }),
    model.count({ where }),
  ])) as [ItemOfModelDelegate<TModel>[], number]

  const totalPages = Math.ceil(total / limit)

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  }
}

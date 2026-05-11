import type { CursorParams, CursorResponse } from '../core'
import { PAGINATION_DEFAULTS } from '../core'

export interface CursorPaginateOptions<T> {
  model: { findMany: (args: unknown) => Promise<T[]> }
  where?: unknown
  include?: unknown
  select?: unknown
  orderBy?: unknown // Must be a unique field (e.g., { id: 'desc' })
  cursorField?: string // default: 'id'
  cursorValue?: string | number | null
  params: CursorParams
}

export async function cursorPaginate<T = unknown>(
  options: CursorPaginateOptions<T>,
): Promise<CursorResponse<T>> {
  const {
    model,
    where = {},
    include,
    select,
    orderBy = { id: 'desc' },
    cursorField = 'id',
    cursorValue = null,
    params,
  } = options

  const limit = Math.min(
    params.limit ?? PAGINATION_DEFAULTS.DEFAULT_LIMIT,
    PAGINATION_DEFAULTS.MAX_LIMIT,
  )

  const take = limit + 1 // fetch one extra to determine next cursor

  let cursor: Record<string, unknown> | undefined = undefined
  if (params.cursor && cursorValue !== null) {
    cursor = { [cursorField]: cursorValue }
  } else if (params.cursor && !cursorValue && cursorField === 'id') {
    // assume cursor is a string/number id
    cursor = { [cursorField]: params.cursor }
  }

  const items = await model.findMany({
    where,
    include,
    select,
    take,
    skip: cursor ? 1 : 0, // skip the cursor item itself
    cursor,
    orderBy,
  })

  const hasNextPage = items.length > limit
  const data = hasNextPage ? items.slice(0, limit) : items
  const nextCursor = hasNextPage
    ? ((data[data.length - 1] as Record<string, unknown>)?.[cursorField] as string | number | null)
    : null

  return {
    data,
    nextCursor,
    hasNextPage,
  }
}

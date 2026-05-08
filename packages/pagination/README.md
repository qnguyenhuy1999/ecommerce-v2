# @ecom/pagination

Centralized pagination utilities for the e-commerce monorepo.

## Features

- ✅ **Offset pagination** - Traditional page-based pagination
- ✅ **Cursor pagination** - Efficient pagination for large datasets
- ✅ **Stable sorting** - Prevents duplicate/missing items across pages
- ✅ **NestJS DTOs** - Validation decorators included
- ✅ **Prisma helpers** - Type-safe database pagination
- ✅ **React hooks** - Frontend pagination state management
- ✅ **TypeScript** - Full type safety

## Installation

```bash
pnpm add @ecom/pagination
```

## Quick Start

### Backend (NestJS + Prisma)

```typescript
import { offsetPaginate, buildOffsetResponse, OffsetPaginationDto } from '@ecom/pagination';

// 1. Extend OffsetPaginationDto in your query DTO
export class ProductQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  status?: string;
}

// 2. Use offsetPaginate in your service
async findAll(query: ProductQueryDto) {
  const where = { status: query.status };
  
  const { items, total } = await offsetPaginate(this.prisma.product, {
    page: query.page,
    pageSize: query.pageSize,
    where,
    orderBy: { createdAt: 'desc' }, // Automatically adds stable sort
  });
  
  return buildOffsetResponse(items, query.page, query.pageSize, total);
}
```

### Frontend (React + React Query)

```typescript
import { usePaginatedQuery } from '@ecom/pagination/react';

function ProductsPage() {
  const { data, isLoading, page, setPage, totalPages } = usePaginatedQuery({
    queryKey: ['products'],
    queryFn: (page, pageSize) => getProducts({ page, pageSize }),
    initialPageSize: 20,
  });

  return (
    <div>
      {data?.items.map(product => <ProductCard key={product.id} {...product} />)}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
```

## API Reference

### Offset Pagination

#### `OffsetPaginationDto`
Base DTO for offset pagination with validation.

**Fields:**
- `page?: number` - Page number (default: 1, min: 1)
- `pageSize?: number` - Items per page (default: 20, min: 1, max: 100)
- `sort?: string` - Sort field (default: 'createdAt')
- `order?: 'asc' | 'desc'` - Sort order (default: 'desc')

#### `offsetPaginate(model, options)`
Paginate Prisma queries with stable sorting.

**Options:**
- `page?: number` - Page number
- `pageSize?: number` - Items per page
- `where?` - Prisma where clause
- `include?` - Prisma include clause
- `select?` - Prisma select clause
- `orderBy?` - Prisma orderBy clause
- `stableSort?: boolean` - Add secondary sort key (default: true)

**Returns:** `{ items: T[], total: number }`

#### `buildOffsetResponse(items, page, pageSize, total)`
Build standardized pagination response.

**Returns:**
```typescript
{
  items: T[],
  meta: {
    page: number,
    pageSize: number,
    total: number,
    totalPages: number
  }
}
```

### Cursor Pagination

#### `CursorPaginationDto`
Base DTO for cursor pagination.

**Fields:**
- `cursor?: string` - Cursor for next page
- `limit?: number` - Items per page (default: 20)

#### `cursorPaginate(model, options)`
Paginate using cursor-based approach.

**Options:**
- `cursor?: string` - Starting cursor
- `limit?: number` - Items per page
- `where?` - Prisma where clause
- `include?` - Prisma include clause
- `select?` - Prisma select clause
- `orderBy?` - Prisma orderBy clause
- `cursorField?: string` - Field to use as cursor (default: 'id')

**Returns:** `{ items: T[], nextCursor: string | null, hasMore: boolean }`

### React Hooks

#### `usePagination(options)`
Manage pagination state.

**Options:**
- `initialPage?: number` - Starting page (default: 1)
- `initialPageSize?: number` - Items per page (default: 20)
- `onPageChange?: (page: number) => void` - Page change callback

**Returns:**
- `page: number` - Current page
- `pageSize: number` - Items per page
- `setPage: (page: number) => void` - Update page
- `setPageSize: (pageSize: number) => void` - Update page size
- `nextPage: () => void` - Go to next page
- `prevPage: () => void` - Go to previous page
- `reset: () => void` - Reset to page 1

#### `usePaginatedQuery(options)`
Combine pagination with React Query.

**Options:**
- All `usePagination` options
- `queryKey: unknown[]` - React Query key
- `queryFn: (page, pageSize) => Promise<PaginatedResponse<T>>` - Fetch function
- `queryOptions?: UseQueryOptions` - Additional React Query options

**Returns:** All `usePagination` returns plus:
- `data: PaginatedResponse<T> | undefined`
- `isLoading: boolean`
- `isError: boolean`
- `error: Error | null`
- `totalPages: number`
- `total: number`

## Stable Sorting

By default, all pagination helpers add a secondary sort key (`id`) to prevent duplicate/missing items when multiple records have the same primary sort value.

```typescript
// Without stable sort (BAD - can cause duplicates)
orderBy: { createdAt: 'desc' }

// With stable sort (GOOD - deterministic order)
orderBy: [{ createdAt: 'desc' }, { id: 'asc' }]
```

Disable stable sorting:
```typescript
await offsetPaginate(model, {
  orderBy: { createdAt: 'desc' },
  stableSort: false, // Not recommended
});
```

## Migration Guide

### From packages/common

```typescript
// Before
import { PaginatedResponse, buildPaginationMeta } from '@ecom/common';

// After
import { PaginatedResponse, buildOffsetResponse } from '@ecom/pagination';
```

### From apps/api-seller

```typescript
// Before
import { PaginationDto } from './common/dto/pagination.dto';

// After
import { OffsetPaginationDto } from '@ecom/pagination';
```

## Constants

```typescript
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@ecom/pagination';

console.log(DEFAULT_PAGE);      // 1
console.log(DEFAULT_PAGE_SIZE); // 20
console.log(MAX_PAGE_SIZE);     // 100
```

## Performance Tips

1. **Add database indexes** for stable sorting:
```sql
CREATE INDEX idx_product_created_id ON "Product"(created_at DESC, id ASC);
```

2. **Use cursor pagination** for:
   - Infinite scroll UIs
   - Large datasets (millions of records)
   - High page numbers (page 1000+)

3. **Use offset pagination** for:
   - Traditional page-based UIs
   - Small to medium datasets
   - When users need to jump to specific pages

## License

MIT

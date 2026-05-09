// Offset pagination types
export interface OffsetPaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: OffsetPaginationMeta;
}

// Cursor pagination types
export interface CursorPaginationMeta {
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export interface CursorPaginatedResponse<T> {
  items: T[];
  meta: CursorPaginationMeta;
}

// Legacy response format (for backward compatibility during migration)
export interface LegacyPaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

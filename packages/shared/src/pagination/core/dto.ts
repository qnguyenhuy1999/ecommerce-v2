/**
 * Plain TypeScript DTOs for pagination (no class-validator decorators).
 * Used for internal typing and non-NestJS environments.
 */
export interface OffsetPaginationDTO {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CursorPaginationDTO {
  cursor?: string;
  limit?: number;
}

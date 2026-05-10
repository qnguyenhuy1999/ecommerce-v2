/**
 * Creates a stable sort order for Prisma queries to ensure consistent pagination.
 * Adds a unique tie-breaker (typically `id`) to the orderBy clause.
 */
export function stableSort<T extends Record<string, unknown>>(
  orderBy: T,
  tieBreaker: string = 'id'
): Record<string, 'asc' | 'desc'> {
  const result = { ...orderBy } as Record<string, unknown>;
  if (!result[tieBreaker]) {
    result[tieBreaker] = 'asc';
  }
  return result as Record<string, 'asc' | 'desc'>;
}

/**
 * Sanitizes orderBy to be safe for Prisma: ensures at least one field is present,
 * and validates asc/desc values.
 */
export function sanitizeOrderBy(
  orderBy: Record<string, 'asc' | 'desc'> | undefined,
  defaultField: string = 'createdAt',
  defaultOrder: 'asc' | 'desc' = 'desc'
): Record<string, 'asc' | 'desc'> {
  if (!orderBy || Object.keys(orderBy).length === 0) {
    return { [defaultField]: defaultOrder };
  }

  const sanitized: Record<string, 'asc' | 'desc'> = {};
  for (const [field, direction] of Object.entries(orderBy)) {
    if (direction === 'asc' || direction === 'desc') {
      sanitized[field] = direction;
    }
  }

  if (Object.keys(sanitized).length === 0) {
    return { [defaultField]: defaultOrder };
  }

  return sanitized;
}

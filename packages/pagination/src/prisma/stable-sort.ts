/**
 * Ensures stable sorting by adding a secondary sort key (id) if not present.
 * This prevents duplicate/missing items across pages when multiple records
 * have the same value for the primary sort field.
 *
 * @param orderBy - Prisma orderBy clause
 * @returns orderBy with guaranteed stable sorting
 *
 * @example
 * // Single field sort
 * buildStableSort({ createdAt: 'desc' })
 * // Returns: [{ createdAt: 'desc' }, { id: 'asc' }]
 *
 * @example
 * // Array sort without id
 * buildStableSort([{ createdAt: 'desc' }, { name: 'asc' }])
 * // Returns: [{ createdAt: 'desc' }, { name: 'asc' }, { id: 'asc' }]
 *
 * @example
 * // Array sort with id already present
 * buildStableSort([{ createdAt: 'desc' }, { id: 'desc' }])
 * // Returns: [{ createdAt: 'desc' }, { id: 'desc' }] (unchanged)
 */
export function buildStableSort(orderBy: unknown): unknown {
  // Handle array orderBy
  if (Array.isArray(orderBy)) {
    const hasId = orderBy.some(
      (o) => typeof o === 'object' && o !== null && 'id' in o
    );
    return hasId ? orderBy : [...orderBy, { id: 'asc' }];
  }

  // Handle object orderBy
  if (typeof orderBy === 'object' && orderBy !== null) {
    // Check if id is already in the object
    if ('id' in orderBy) {
      return orderBy;
    }
    return [orderBy, { id: 'asc' }];
  }

  // Fallback to id sorting
  return [{ id: 'asc' }];
}

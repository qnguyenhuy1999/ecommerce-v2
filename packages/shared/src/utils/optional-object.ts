/**
 * Strip `undefined` values from an object, returning only the defined entries.
 *
 * Safe to use with `exactOptionalPropertyTypes: true` — the returned object
 * will never contain `{ key: undefined }` entries.
 *
 * @example
 * const query = withDefined({ name: 'Alice', age: undefined })
 * // => { name: 'Alice' }  (age is omitted, not set to undefined)
 */
export function withDefined<T extends Record<string, unknown>>(value: T): Partial<T> {
  const result: Partial<T> = {}
  for (const key of Object.keys(value) as (keyof T)[]) {
    if (value[key] !== undefined) {
      result[key] = value[key]
    }
  }
  return result
}

/**
 * Convert `undefined` to `null`. Useful when a Prisma field expects `null`
 * to clear a value but the source may be `undefined`.
 *
 * @example
 * const avatar = nullable(user.avatar) // string | null
 */
export function nullable<T>(value: T | undefined): T | null {
  return value ?? null
}

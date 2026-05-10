export type QueryParamValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryParamValue | QueryParamValue[]>;

/**
 * Build a query string from an object of parameters.
 * @param params - Object with query parameters
 * @returns URL query string (without leading '?')
 */
export function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null) {
          searchParams.append(key, String(item));
        }
      }
    } else {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
}

/**
 * Build a full URL with query parameters.
 * @param baseUrl - Base URL (may already contain query string)
 * @param params - Object with query parameters
 * @returns Full URL with query string
 */
export function buildUrlWithQuery(baseUrl: string, params: QueryParams): string {
  const queryString = buildQueryString(params);
  if (!queryString) return baseUrl;

  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${queryString}`;
}

/**
 * Parse a query string into an object.
 * @param queryString - URL query string (with or without leading '?')
 * @returns Object of query parameters
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const withoutLeading = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  const result: Record<string, string> = {};

  const params = new URLSearchParams(withoutLeading);
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
}

/**
 * Remove empty or null values from query parameters.
 * @param params - Object with query parameters
 * @returns Filtered object
 */
export function filterEmptyParams<T extends QueryParams>(params: T): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (typeof value === 'string' && value === '') continue;
    result[key as keyof T] = value as T[keyof T];
  }

  return result;
}

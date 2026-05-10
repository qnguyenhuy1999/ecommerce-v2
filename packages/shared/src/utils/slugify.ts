/**
 * Convert a string to a URL-friendly slug.
 * @param input - The string to slugify
 * @returns The slugified string
 */
export function slugify(input: string): string {
  if (!input) return '';

  return input
    .toString()
    .normalize('NFKD') // Decompose accented characters
    .replace(/[̀-ͯ]/g, '') // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

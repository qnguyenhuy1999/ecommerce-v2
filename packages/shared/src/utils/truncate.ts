/**
 * Truncate a string to a maximum length, adding an ellipsis if truncated.
 * @param str - The string to truncate
 * @param length - Maximum length (default: 100)
 * @param ellipsis - Ellipsis character(s) (default: '...')
 * @returns Truncated string
 */
export function truncate(str: string, length: number = 100, ellipsis: string = '...'): string {
  if (!str) return ''
  if (str.length <= length) return str
  return str.slice(0, length - ellipsis.length) + ellipsis
}

/**
 * Truncate a string by words, preserving whole words where possible.
 * @param str - The string to truncate
 * @param wordCount - Maximum number of words (default: 20)
 * @param ellipsis - Ellipsis character(s) (default: '...')
 * @returns Truncated string
 */
export function truncateByWords(
  str: string,
  wordCount: number = 20,
  ellipsis: string = '...',
): string {
  if (!str) return ''
  const words = str.trim().split(/\s+/)
  if (words.length <= wordCount) return str
  return words.slice(0, wordCount).join(' ') + ellipsis
}

/**
 * Truncate a string to a maximum number of characters, but ensure it ends at a word boundary.
 * @param str - The string to truncate
 * @param length - Maximum length (default: 100)
 * @param ellipsis - Ellipsis character(s) (default: '...')
 * @returns Truncated string
 */
export function truncateToWord(
  str: string,
  length: number = 100,
  ellipsis: string = '...',
): string {
  if (!str) return ''
  if (str.length <= length) return str

  const truncated = str.slice(0, length - ellipsis.length)
  const lastSpace = truncated.lastIndexOf(' ')
  if (lastSpace === -1) return truncated + ellipsis
  return truncated.slice(0, lastSpace) + ellipsis
}

/**
 * Convert a string to a URL-friendly slug.
 *
 * Lowercases, trims, strips characters that are not letters, numbers,
 * whitespace, underscores or hyphens, then collapses whitespace and
 * underscores into single hyphens. Leading/trailing hyphens are removed.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

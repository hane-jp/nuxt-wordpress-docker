/** WordPress returns Unicode slugs percent-encoded. Encode each slug only once. */
export function postPath(slug: string): string {
  let decoded = slug
  try {
    decoded = decodeURIComponent(slug)
  } catch {
    // Treat an unmatched percent sign as literal text.
  }
  return `/posts/${encodeURIComponent(decoded)}`
}

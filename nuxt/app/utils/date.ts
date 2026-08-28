export function formatDate(value: string, locale = 'ja-JP'): string {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(value))
}

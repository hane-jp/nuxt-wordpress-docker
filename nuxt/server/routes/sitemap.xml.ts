import { fetchWordPressPosts } from '../utils/wordpress'

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;')

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq: 'daily' | 'weekly' | 'monthly'
  priority: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')
  const urls: SitemapUrl[] = [
    { loc: `${siteUrl}/`, changefreq: 'weekly', priority: '1.0' },
    { loc: `${siteUrl}/posts`, changefreq: 'daily', priority: '0.8' },
    { loc: `${siteUrl}/guide`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${siteUrl}/guide/en`, changefreq: 'monthly', priority: '0.5' }
  ]

  try {
    const posts = await fetchWordPressPosts(config.wpApiBase, { per_page: 100 })
    urls.push(...posts.map(post => ({
      loc: `${siteUrl}/posts/${encodeURIComponent(post.slug)}`,
      lastmod: post.date,
      changefreq: 'weekly',
      priority: '0.7'
    })))
  } catch {
    // Keep the static routes available while WordPress is offline or uninitialized.
  }

  const body = urls.map(url => [
    '  <url>',
    `    <loc>${escapeXml(url.loc)}</loc>`,
    'lastmod' in url ? `    <lastmod>${escapeXml(url.lastmod)}</lastmod>` : '',
    `    <changefreq>${url.changefreq}</changefreq>`,
    `    <priority>${url.priority}</priority>`,
    '  </url>'
  ].filter(Boolean).join('\n')).join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
})

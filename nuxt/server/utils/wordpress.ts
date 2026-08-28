import sanitizeHtml from 'sanitize-html'
import type { PostDetail } from '#shared/types/post'

export interface WordPressPost {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string
      alt_text?: string
    }>
  }
}

export async function fetchWordPressPosts(
  apiBase: string,
  query: Record<string, string | number>
): Promise<WordPressPost[]> {
  try {
    return await $fetch<WordPressPost[]>(`${apiBase}/wp/v2/posts`, { query })
  } catch (prettyUrlError) {
    const fallbackUrl = apiBase.replace(/\/wp-json\/?$/, '/index.php')

    if (fallbackUrl === apiBase) {
      throw prettyUrlError
    }

    return await $fetch<WordPressPost[]>(fallbackUrl, {
      query: { rest_route: '/wp/v2/posts', ...query }
    })
  }
}

const textOnly = (html: string) => sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim()

export function mapWordPressPost(post: WordPressPost): PostDetail {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]

  return {
    id: post.id,
    slug: post.slug,
    title: textOnly(post.title.rendered),
    excerpt: textOnly(post.excerpt.rendered),
    content: sanitizeHtml(post.content.rendered, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt', 'width', 'height', 'loading']
      }
    }),
    publishedAt: post.date,
    imageUrl: featuredMedia?.source_url ?? null,
    imageAlt: featuredMedia?.alt_text || textOnly(post.title.rendered)
  }
}

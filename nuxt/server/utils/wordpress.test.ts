import { describe, expect, it } from 'vitest'
import { mapWordPressPost } from './wordpress'

describe('mapWordPressPost', () => {
  it('maps embedded media and strips markup from summary fields', () => {
    const post = mapWordPressPost({
      id: 42,
      slug: 'hello-world',
      date: '2026-08-28T10:00:00',
      title: { rendered: 'Hello <em>WordPress</em>' },
      excerpt: { rendered: '<p>A useful excerpt.</p>' },
      content: { rendered: '<p>Safe content</p><script>alert(1)</script>' },
      _embedded: {
        'wp:featuredmedia': [{ source_url: 'https://example.com/image.jpg', alt_text: 'Cover' }]
      }
    })

    expect(post).toMatchObject({
      id: 42,
      slug: 'hello-world',
      title: 'Hello WordPress',
      excerpt: 'A useful excerpt.',
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: 'Cover'
    })
    expect(post.content).toBe('<p>Safe content</p>')
  })

  it('falls back to the title when featured image alt text is empty', () => {
    const post = mapWordPressPost({
      id: 1,
      slug: 'no-image',
      date: '2026-08-28T10:00:00',
      title: { rendered: 'Fallback title' },
      excerpt: { rendered: '' },
      content: { rendered: '' }
    })

    expect(post.imageUrl).toBeNull()
    expect(post.imageAlt).toBe('Fallback title')
  })
})

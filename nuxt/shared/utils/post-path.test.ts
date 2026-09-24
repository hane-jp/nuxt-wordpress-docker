import { describe, expect, it } from 'vitest'
import { postPath } from './post-path'

describe('postPath', () => {
  it('uses the same URL for raw and WordPress-encoded Japanese slugs', () => {
    const slug = '日本語の記事'
    const expected = `/posts/${encodeURIComponent(slug)}`
    expect(postPath(slug)).toBe(expected)
    expect(postPath(encodeURIComponent(slug).toLowerCase())).toBe(expected)
  })

  it('preserves English slugs and safely encodes literal percent signs', () => {
    expect(postPath('hello-world')).toBe('/posts/hello-world')
    expect(postPath('100%')).toBe('/posts/100%25')
    expect(postPath('a%2Fb')).toBe('/posts/a%2Fb')
  })
})

export interface PostSummary {
  id: number
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  imageUrl: string | null
  imageAlt: string
}

export interface PostDetail extends PostSummary {
  content: string
}

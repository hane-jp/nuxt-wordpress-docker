import type { PostSummary } from '#shared/types/post'
import { fetchWordPressPosts, mapWordPressPost } from '../../utils/wordpress'

export default defineEventHandler(async (): Promise<PostSummary[]> => {
  const config = useRuntimeConfig()

  try {
    const posts = await fetchWordPressPosts(config.wpApiBase, { _embed: 1, per_page: 12 })

    return posts.map((post) => {
      const { content: _sanitizedContent, ...summary } = mapWordPressPost(post)
      return summary
    })
  } catch (error) {
    throw createError({
      statusCode: 502,
      message: 'WordPress APIに接続できませんでした。WordPressの起動とAPI URLを確認してください。',
      cause: error
    })
  }
})

import type { PostDetail } from '#shared/types/post'
import { fetchWordPressPosts, mapWordPressPost } from '../../utils/wordpress'

export default defineEventHandler(async (event): Promise<PostDetail> => {
  const slug = getRouterParam(event, 'slug')
  const config = useRuntimeConfig()

  if (!slug) {
    throw createError({ statusCode: 400, message: '投稿スラッグが必要です。' })
  }

  try {
    const posts = await fetchWordPressPosts(config.wpApiBase, { slug, _embed: 1 })

    if (!posts[0]) {
      throw createError({ statusCode: 404, message: '投稿が見つかりませんでした。' })
    }

    return mapWordPressPost(posts[0])
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error && error.statusCode === 404) {
      throw error
    }

    throw createError({
      statusCode: 502,
      message: 'WordPress APIに接続できませんでした。',
      cause: error
    })
  }
})

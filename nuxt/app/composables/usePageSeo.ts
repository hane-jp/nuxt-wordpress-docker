import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

interface PageSeoOptions {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string | undefined>
  image?: MaybeRefOrGetter<string | null | undefined>
  type?: 'website' | 'article'
  locale?: string
  publishedTime?: MaybeRefOrGetter<string | undefined>
}

export function usePageSeo(options: PageSeoOptions) {
  const route = useRoute()
  const config = useRuntimeConfig()
  const siteUrl = computed(() => String(config.public.siteUrl).replace(/\/$/, ''))
  const canonicalUrl = computed(() => new URL(route.path, `${siteUrl.value}/`).toString())
  const imageUrl = computed(() => {
    const image = options.image ? toValue(options.image) || '/og-image.png' : '/og-image.png'
    return new URL(image, `${siteUrl.value}/`).toString()
  })

  useSeoMeta({
    title: () => toValue(options.title),
    description: () => toValue(options.description),
    ogTitle: () => toValue(options.title),
    ogDescription: () => toValue(options.description),
    ogType: options.type || 'website',
    ogUrl: () => canonicalUrl.value,
    ogImage: () => imageUrl.value,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: () => toValue(options.title),
    ogSiteName: 'Nuxt × WordPress Starter',
    ogLocale: options.locale || 'ja_JP',
    twitterCard: 'summary_large_image',
    twitterTitle: () => toValue(options.title),
    twitterDescription: () => toValue(options.description),
    twitterImage: () => imageUrl.value,
    articlePublishedTime: options.publishedTime ? () => toValue(options.publishedTime!) : undefined
  })

  useHead(() => ({
    link: [{ rel: 'canonical', href: canonicalUrl.value }]
  }))

  return { canonicalUrl, imageUrl }
}

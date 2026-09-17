import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { articles as staticArticles } from '@/lib/articles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.inskjutning.se'

  // Hämta artiklarnas slugs. Saknas databasen ska sitemapen ändå kunna byggas.
  let articleUrls: MetadataRoute.Sitemap = []
  try {
    const { data: articles } = await supabase.from('articles').select('slug, updated_at')
    articleUrls =
      articles?.map((article) => ({
        url: `${baseUrl}/artiklar/${article.slug}`,
        lastModified: article.updated_at,
      })) ?? []
  } catch {
    articleUrls = []
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/artiklar`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/maltavlor`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
    },
    // Artiklarna som ligger som egna sidor i koden
    ...staticArticles.map((article) => ({
      url: `${baseUrl}/artiklar/${article.slug}`,
      lastModified: article.updated ?? article.published ?? new Date(),
    })),
    ...articleUrls,
  ]
}

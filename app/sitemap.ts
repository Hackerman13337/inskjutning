import { MetadataRoute } from 'next'
import { articles } from '@/lib/articles'

const BASE_URL = 'https://www.inskjutning.se'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/maltavlor`, lastModified: new Date() },
    { url: `${BASE_URL}/artiklar`, lastModified: new Date() },
    ...articles.map((article) => ({
      url: `${BASE_URL}/artiklar/${article.slug}`,
      lastModified: article.updated ?? article.published ?? new Date(),
    })),
  ]
}

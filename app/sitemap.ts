import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.inskjutning.se'

  // Fetch all article slugs from the database
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')

  const articleUrls = articles?.map((article) => ({
    url: `${baseUrl}/artiklar/${article.slug}`,
    lastModified: article.updated_at,
  })) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/artiklar/hawke`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/maltavlor`,
      lastModified: new Date(),
    },
    ...articleUrls,
    // Lägg till fler URL:er här för andra sidor i din app
  ]
}

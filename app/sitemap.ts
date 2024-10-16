import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.inskjutning.se'

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
    // Lägg till fler URL:er här för andra sidor i din app
  ]
}

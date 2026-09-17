import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Inskjutning — klick på kikarsiktet',
    short_name: 'Inskjutning',
    description:
      'Markera träffen på tavlan och få direkt hur många klick du ska vrida kikarsiktet. Fungerar utan täckning.',
    lang: 'sv-SE',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0e1116',
    theme_color: '#0e1116',
    categories: ['utilities', 'sports'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}

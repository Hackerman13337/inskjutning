/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aktivera strikt mod för bättre felhantering och optimeringar
  reactStrictMode: true,

  // Om du använder internationalisering (i18n)
  i18n: {
    locales: ['sv'],
    defaultLocale: 'sv',
  },

  // Om du behöver anpassa webpack-konfigurationen
  webpack: (config, { isServer }) => {
    // Gör anpassningar här om det behövs
    return config
  },

  // Om du använder miljövariabler som ska vara tillgängliga på klientsidan
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Om du behöver hantera omdirigeringar eller anpassade headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },

  // Om du vill optimera bilder med Next.js Image-komponenten
  images: {
    domains: ['din-domän.com'], // Lägg till domäner för externa bilder här
  },
}

export default nextConfig

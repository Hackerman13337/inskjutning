import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from '@vercel/analytics/react'
import { InstallPrompt } from "@/components/install-prompt"
import { ServiceWorkerRegistration } from "@/components/service-worker"
import { themeScript } from "@/lib/theme-script"

const inter = Inter({ subsets: ["latin", "latin-ext"], display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: "Inskjutning — räkna ut klick på kikarsiktet",
    template: "%s · Inskjutning",
  },
  description:
    "Markera träffen på tavlan så får du direkt hur många klick du ska vrida kikarsiktet i höjd och sida. Stöd för skottgrupper, MOA, MIL och egna vapenprofiler.",
  keywords: [
    "inskjutning", "kikarsikte", "klick", "MOA", "MIL", "jakt", "skytte", "träffpunkt", "måltavla",
  ],
  applicationName: 'Inskjutning',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: 'Inskjutning',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    title: 'Inskjutning — räkna ut klick på kikarsiktet',
    description:
      'Markera träffen på tavlan så får du direkt hur många klick du ska vrida siktet.',
  },
  verification: {
    google: 'uGHOPnZ4WuhvRg9PCtS3d2IMMCcKMzYHE85_IfJ_QIg',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f3ec' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1116' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <InstallPrompt />
        <Toaster />
        <ServiceWorkerRegistration />
        <Analytics />
      </body>
    </html>
  )
}

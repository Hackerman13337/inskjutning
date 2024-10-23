import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { FeedbackButton } from "@/components/feedback-button"
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Inskjutning",
  description: "Beräkna inskjutning för ditt vapen",
  icons: {
    icon: '/image/logofav.png',
    apple: '/image/logofav.png',
  },
  // Lägg till detta nya fält
  verification: {
    google: 'uGHOPnZ4WuhvRg9PCtS3d2IMMCcKMzYHE85_IfJ_QIg',
  },
  // Andra metadata-fält kan finnas här
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <FeedbackButton variant="icon" />
        <Analytics />
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { FeedbackButton } from "@/components/feedback-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Inskjutning",
  description: "Beräkna inskjutning för ditt vapen",
  icons: {
    icon: '/image/logofav.png',
    apple: '/image/logofav.png',
  },
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
        <FeedbackButton type="feedback" />
        <FeedbackButton type="contact" />
        {children}
      </body>
    </html>
  )
}

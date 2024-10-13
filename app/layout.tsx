import { Header } from '@/components/header'
import { FeedbackButton } from '@/components/feedback-button'
import { Toaster } from '@/components/ui/toaster'
import '@/app/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        {/* Visa endast på större skärmar */}
        <div className="hidden md:block">
          <FeedbackButton variant="icon" />
        </div>
        <Toaster />
      </body>
    </html>
  )
}

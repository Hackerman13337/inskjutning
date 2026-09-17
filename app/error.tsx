'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center sm:py-28">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <TriangleAlert className="h-7 w-7" />
      </span>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">Något gick fel</h1>
      <p className="mt-3 text-muted-foreground">
        Sidan kunde inte visas. Dina sparade vapen och din logg ligger kvar i telefonen och
        påverkas inte.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Button onClick={reset}>Försök igen</Button>
        <Button asChild variant="outline">
          <Link href="/">Till verktyget</Link>
        </Button>
      </div>

      {error.digest && (
        <p className="mt-6 text-xs text-muted-foreground/70 tabular">Felkod: {error.digest}</p>
      )}
    </main>
  )
}

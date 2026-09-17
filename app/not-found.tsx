import Link from 'next/link'
import { Crosshair } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center sm:py-28">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Crosshair className="h-7 w-7" />
      </span>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">Bom</h1>
      <p className="mt-3 text-muted-foreground">
        Sidan du letade efter finns inte. Den kan ha flyttat, eller så blev det fel i adressen.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Button asChild>
          <Link href="/">Till verktyget</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/artiklar">Läs artiklarna</Link>
        </Button>
      </div>
    </main>
  )
}

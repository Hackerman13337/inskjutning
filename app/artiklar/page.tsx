import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import { articles } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Artiklar om inskjutning',
  description:
    'Guider om att skjuta in kikarsiktet: klickvärden i MOA och MIL, hur du läser träffbilden, inskjutning på 50 meter och kontroll inför jakten.',
}

export default function ArticlesPage() {
  // Nyast först. Artiklar utan datum hamnar sist.
  const items = [...articles].sort((a, b) => {
    if (!a.published && !b.published) return 0
    if (!a.published) return 1
    if (!b.published) return -1
    return Date.parse(b.published) - Date.parse(a.published)
  })

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Artiklar</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Guider om inskjutning, klickvärden och hur du läser din träffbild — skrivna för att
          gå att använda vid bänken, inte bara läsa.
        </p>
      </header>

      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/artiklar/${item.slug}`}
              className="flex items-start justify-between gap-4 p-4 transition-colors hover:bg-accent/40 sm:p-5"
            >
              <span className="min-w-0">
                <span className="block font-medium">{item.title}</span>

                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {item.excerpt}
                </span>

                <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {item.published && (
                    <time dateTime={item.published} className="tabular">
                      {new Date(item.published).toLocaleDateString('sv-SE', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  )}
                  <span className="flex items-center gap-1 tabular">
                    <Clock className="h-3 w-3" />
                    {item.readingMinutes} min
                  </span>
                </span>
              </span>

              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

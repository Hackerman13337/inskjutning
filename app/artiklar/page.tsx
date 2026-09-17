import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import { articles as staticArticles } from '@/lib/articles'

// Listan ska alltid spegla databasen, inte ett bygge från i förrgår.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Artiklar om inskjutning',
  description:
    'Guider om att skjuta in kikarsiktet: klickvärden i MOA och MIL, hur du läser träffbilden, inskjutning på 50 meter och kontroll inför jakten.',
}

interface DbArticle {
  id: string
  title: string
  slug: string
  created_at: string
}

interface ListItem {
  key: string
  title: string
  excerpt: string | null
  href: string
  date: string | null
  readingMinutes: number | null
}

async function getDbArticles(): Promise<DbArticle[]> {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data } = await supabase
      .from('articles')
      .select('id, title, slug, created_at')
      .order('created_at', { ascending: false })
    return (data as DbArticle[]) ?? []
  } catch {
    return []
  }
}

export default async function ArticlesPage() {
  const dbArticles = await getDbArticles()

  const items: ListItem[] = [
    ...staticArticles.map((article) => ({
      key: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      href: `/artiklar/${article.slug}`,
      date: article.published ?? null,
      readingMinutes: article.readingMinutes,
    })),
    ...dbArticles.map((article) => ({
      key: article.id,
      title: article.title,
      excerpt: null,
      href: `/artiklar/${article.slug}`,
      date: article.created_at,
      readingMinutes: null,
    })),
  ].sort((a, b) => {
    // Odaterade artiklar hamnar sist, nyast först bland de övriga.
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return Date.parse(b.date) - Date.parse(a.date)
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

      {items.length > 0 ? (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="flex items-start justify-between gap-4 p-4 transition-colors hover:bg-accent/40 sm:p-5"
              >
                <span className="min-w-0">
                  <span className="block font-medium">{item.title}</span>

                  {item.excerpt && (
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {item.excerpt}
                    </span>
                  )}

                  <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {item.date && (
                      <time dateTime={item.date} className="tabular">
                        {new Date(item.date).toLocaleDateString('sv-SE', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </time>
                    )}
                    {item.readingMinutes && (
                      <span className="flex items-center gap-1 tabular">
                        <Clock className="h-3 w-3" />
                        {item.readingMinutes} min
                      </span>
                    )}
                  </span>
                </span>

                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-sm font-medium text-muted-foreground">Inga artiklar publicerade än</p>
        </div>
      )}
    </main>
  )
}

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock, Crosshair } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JsonLd } from '@/components/JsonLd'
import { relatedArticles, type ArticleMeta } from '@/lib/articles'

const SITE_URL = 'https://www.inskjutning.se'

interface ArticleLayoutProps {
  article: ArticleMeta
  /** Ingressen — visas större än brödtexten, direkt under rubriken. */
  lead: string
  children: React.ReactNode
  /** Extra strukturerad data, t.ex. HowTo eller FAQPage. */
  extraJsonLd?: Record<string, unknown>
}

function formatDate(iso?: string): string | null {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function ArticleLayout({ article, lead, children, extraJsonLd }: ArticleLayoutProps) {
  const published = formatDate(article.published)
  const updated = formatDate(article.updated)
  const related = relatedArticles(article.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    inLanguage: 'sv-SE',
    mainEntityOfPage: `${SITE_URL}/artiklar/${article.slug}`,
    ...(article.published && { datePublished: article.published }),
    ...(article.updated && { dateModified: article.updated }),
    publisher: {
      '@type': 'Organization',
      name: 'Inskjutning.se',
      url: SITE_URL,
    },
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <JsonLd data={jsonLd} />
      {extraJsonLd && <JsonLd data={extraJsonLd as never} />}

      <Link
        href="/artiklar"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Alla artiklar
      </Link>

      <header className="mt-5">
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {article.title}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{lead}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {published && (
            <time dateTime={article.published} className="tabular">
              {updated ? `Uppdaterad ${updated}` : published}
            </time>
          )}
          <span className="flex items-center gap-1.5 tabular">
            <Clock className="h-3.5 w-3.5" />
            {article.readingMinutes} min läsning
          </span>
        </div>
      </header>

      <div
        className="prose prose-sm mt-10 max-w-none dark:prose-invert sm:prose-base
          prose-headings:scroll-mt-24 prose-headings:tracking-tight
          prose-h2:mt-10 prose-h2:text-2xl prose-h3:text-lg
          prose-p:leading-relaxed prose-a:font-medium prose-a:text-primary
          prose-li:leading-relaxed prose-strong:text-foreground
          prose-table:text-sm prose-th:text-left"
      >
        {children}
      </div>

      <aside className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Crosshair className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold">Räkna ut dina klick</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Markera var kulan träffade på tavlan så får du direkt hur många klick du ska vrida
              i höjd och sida. Gratis, och fungerar i mobilen på banan.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/">Till verktyget</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/maltavlor">Hämta måltavlor</Link>
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Läs vidare</h2>
          <ul className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/artiklar/${item.slug}`}
                  className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-accent/40"
                >
                  <span>
                    <span className="block font-medium">{item.title}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {item.excerpt}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

/** Faktaruta som bryter ut ur brödtexten. */
export function Callout({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="not-prose my-6 rounded-xl border border-border bg-surface/60 p-4 sm:p-5">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  )
}

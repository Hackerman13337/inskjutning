import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { JsonLd } from '@/components/JsonLd'
import { ArticleContent } from '@/components/article-content'

interface ArticleProps {
  params: { slug: string }
}

interface Article {
  title: string
  content: string
  meta_description: string | null
  created_at: string
  updated_at: string | null
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data } = await supabase
      .from('articles')
      .select('title, content, meta_description, created_at, updated_at')
      .eq('slug', slug)
      .maybeSingle()

    return (data as Article) ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: ArticleProps): Promise<Metadata> {
  const article = await getArticle(params.slug)

  if (!article) {
    return { title: 'Artikeln finns inte' }
  }

  return {
    title: article.title,
    description: article.meta_description ?? undefined,
  }
}

export default async function ArticlePage({ params }: ArticleProps) {
  const article = await getArticle(params.slug)

  // Utan den här kontrollen kraschade sidan med ett 500-fel på okända adresser.
  if (!article) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.meta_description ?? '',
    datePublished: article.created_at,
    dateModified: article.updated_at ?? article.created_at,
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <JsonLd data={jsonLd} />

      <Link
        href="/artiklar"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Alla artiklar
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{article.title}</h1>

      <p className="mt-2 text-sm text-muted-foreground tabular">
        {new Date(article.created_at).toLocaleDateString('sv-SE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>

      <div className="mt-8">
        <ArticleContent content={article.content} />
      </div>
    </main>
  )
}

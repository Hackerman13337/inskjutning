import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { JsonLd } from '@/components/JsonLd'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { ArticleContent } from '@/components/article-content'

interface ArticleProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ArticleProps): Promise<Metadata> {
  const { data: article } = await supabase
    .from('articles')
    .select('title, meta_description')
    .eq('slug', params.slug)
    .single()

  if (!article) {
    return {
      title: 'Artikel inte hittad',
    }
  }

  return {
    title: `${article.title} | Din Webbplats`,
    description: article.meta_description,
  }
}

export default async function ArticlePage({ params }: ArticleProps) {
  const supabase = createServerComponentClient({ cookies })
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .single()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.meta_description,
    "datePublished": article.created_at,
    "dateModified": article.updated_at,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={jsonLd} />
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <ArticleContent content={article.content} />
    </div>
  )
}

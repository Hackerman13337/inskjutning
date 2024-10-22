import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function ArticlesPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Artiklar</h1>
      {articles && articles.length > 0 ? (
        <ul className="space-y-4">
          {articles.map((article) => (
            <li key={article.id}>
              <Link href={`/artiklar/${article.slug}`} className="text-blue-600 hover:underline">
                {article.title}
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(article.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Inga artiklar tillgängliga.</p>
      )}
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  slug: string
  created_at: string
}

export function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/articles')
        if (!response.ok) {
          throw new Error('Failed to fetch articles')
        }
        const data = await response.json()
        setArticles(data)
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [])

  if (isLoading) return <div>Loading articles...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artiklar</CardTitle>
      </CardHeader>
      <CardContent>
        <Link href="/admin/articles/new">
          <Button className="mb-4">Skapa ny artikel</Button>
        </Link>
        {articles.length === 0 ? (
          <p>Inga artiklar ännu.</p>
        ) : (
          <ul className="space-y-2">
            {articles.map((article) => (
              <li key={article.id} className="flex justify-between items-center">
                <span>{article.title}</span>
                <Link href={`/admin/articles/${article.id}`}>
                  <Button variant="outline">Redigera</Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

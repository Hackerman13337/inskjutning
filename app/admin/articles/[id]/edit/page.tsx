'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ArticleData {
  title: string
  content: string
  metaDescription: string
  slug: string
}

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [article, setArticle] = useState<ArticleData>({
    title: '',
    content: '',
    metaDescription: '',
    slug: '',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchArticle() {
      if (params.id === 'new') {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/articles/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setArticle(data)
        } else {
          throw new Error('Failed to fetch article')
        }
      } catch (error) {
        console.error('Error fetching article:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticle()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = params.id === 'new' ? '/api/articles' : `/api/articles/${params.id}`
      const method = params.id === 'new' ? 'POST' : 'PUT'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      })

      if (response.ok) {
        router.push('/admin/dashboard')
      } else {
        throw new Error('Failed to save article')
      }
    } catch (error) {
      console.error('Error saving article:', error)
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>{params.id === 'new' ? 'Skapa ny artikel' : 'Redigera artikel'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-1">Titel</label>
            <Input
              id="title"
              value={article.title}
              onChange={(e) => setArticle({ ...article, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="slug" className="block mb-1">Slug</label>
            <Input
              id="slug"
              value={article.slug}
              onChange={(e) => setArticle({ ...article, slug: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="metaDescription" className="block mb-1">Meta beskrivning</label>
            <Textarea
              id="metaDescription"
              value={article.metaDescription}
              onChange={(e) => setArticle({ ...article, metaDescription: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block mb-1">Innehåll</label>
            <Textarea
              id="content"
              value={article.content}
              onChange={(e) => setArticle({ ...article, content: e.target.value })}
              required
              className="min-h-[300px]"
            />
          </div>
          <Button type="submit">Spara artikel</Button>
        </form>
      </CardContent>
    </Card>
  )
}

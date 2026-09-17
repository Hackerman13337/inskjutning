'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { QuillEditor } from '@/components/quill-editor'

interface ArticleData {
  title: string
  content: string
  metaDescription: string
  slug: string
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [article, setArticle] = useState<ArticleData>({
    title: '',
    content: '',
    metaDescription: '',
    slug: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

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
          // Databasen använder meta_description, formuläret metaDescription.
          // Utan den här översättningen kom fältet alltid upp tomt.
          setArticle({
            title: data.title ?? '',
            slug: data.slug ?? '',
            content: data.content ?? '',
            metaDescription: data.meta_description ?? '',
          })
        } else {
          throw new Error('Kunde inte hämta artikeln')
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
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No active session')
      }

      const url = params.id === 'new' ? '/api/articles' : `/api/articles/${params.id}`
      const method = params.id === 'new' ? 'POST' : 'PUT'
      
      // API:t läser sessionen ur kakan, så någon Authorization-header behövs inte.
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to save article: ${errorData.error || response.statusText}`)
      }

      await response.json()
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error saving article:', error)
      // Hantera fel här
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <Card className="max-w-4xl mx-auto mt-8">
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
            <QuillEditor
              initialValue={article.content}
              onChange={(value) => setArticle({ ...article, content: value })}
            />
          </div>
          <Button type="submit">Spara artikel</Button>
        </form>
      </CardContent>
    </Card>
  )
}

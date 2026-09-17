'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface FeedbackItem {
  timestamp: string
  content: string
}

const ITEMS_PER_PAGE = 10

export function FeedbackList() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const response = await fetch('/api/feedback')

        if (response.status === 401) {
          setError('Du är inte längre inloggad. Ladda om sidan och logga in igen.')
          return
        }

        if (!response.ok) throw new Error('Kunde inte hämta feedback')

        setFeedback(await response.json())
      } catch {
        setError('Kunde inte ladda feedbacken. Försök igen om en stund.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  if (isLoading) return <div className="text-sm text-muted-foreground">Laddar feedback…</div>
  if (error) return <div className="text-sm text-destructive">{error}</div>

  const totalPages = Math.ceil(feedback.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentFeedback = feedback.slice(startIndex, endIndex)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback från användare</CardTitle>
      </CardHeader>
      <CardContent>
        {currentFeedback.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ingen feedback ännu.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {currentFeedback.map((item, index) => {
                const parsed = item.timestamp ? new Date(item.timestamp) : null
                const formattedDate =
                  parsed && !Number.isNaN(parsed.getTime())
                    ? parsed.toLocaleString('sv-SE', { dateStyle: 'medium', timeStyle: 'short' })
                    : 'Okänt datum'
                return (
                  <li key={index} className="border-b pb-2">
                    <p className="text-xs text-muted-foreground tabular">{formattedDate}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm">{item.content}</p>
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-between mt-4">
              <Button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Föregående
              </Button>
              <span className="text-sm text-muted-foreground">Sida {currentPage} av {totalPages}</span>
              <Button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Nästa
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

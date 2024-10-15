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
      console.log('Fetching feedback...')
      try {
        const response = await fetch('/api/feedback')
        console.log('Response status:', response.status)
        if (response.ok) {
          const data = await response.json()
          console.log('Received feedback data:', data)
          setFeedback(data)
        } else {
          throw new Error('Failed to fetch feedback')
        }
      } catch (error) {
        console.error('Error fetching feedback:', error)
        setError('Failed to load feedback. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  if (isLoading) return <div>Loading feedback...</div>
  if (error) return <div>Error: {error}</div>

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
          <p>Ingen feedback ännu.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {currentFeedback.map((item, index) => {
                let formattedDate = 'Invalid Date';
                if (item.timestamp) {
                  const parts = item.timestamp.split(/[T.]/);
                  if (parts.length >= 2) {
                    const [datePart, timePart] = parts;
                    formattedDate = `${datePart} ${timePart}`;
                  }
                }
                return (
                  <li key={index} className="border-b pb-2">
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                    <p>{item.content}</p>
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
              <span>Page {currentPage} of {totalPages}</span>
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

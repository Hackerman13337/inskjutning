'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FeedbackList } from '@/components/feedback-list'
import { ArticleList } from '@/components/article-list'

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'feedback' | 'articles'>('articles')

  // Använd en effekt för att uppdatera komponenten när den monteras
  useEffect(() => {
    // Detta kommer att tvinga en omrendering av ArticleList
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Button 
        onClick={() => setActiveTab('feedback')}
        variant={activeTab === 'feedback' ? 'default' : 'outline'}
        className="mr-2"
      >
        Feedback
      </Button>
      <Button 
        onClick={() => setActiveTab('articles')}
        variant={activeTab === 'articles' ? 'default' : 'outline'}
      >
        Artiklar
      </Button>
      {activeTab === 'feedback' && <FeedbackList />}
      {activeTab === 'articles' && <ArticleList key={Date.now()} />}
    </div>
  )
}

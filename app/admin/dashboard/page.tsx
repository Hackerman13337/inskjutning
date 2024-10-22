'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FeedbackList } from '@/components/feedback-list'
import { ArticleList } from '@/components/article-list'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'feedback' | 'articles'>('articles')

  useEffect(() => {
    const handleLogout = async () => {
      const supabase = createClientComponentClient()
      await supabase.auth.signOut()
      router.push('/admin')
    }
  }, [router])

  const handleLogout = async () => {
    const supabase = createClientComponentClient()
    await supabase.auth.signOut()
    router.push('/admin')
  }

  // Använd en effekt för att uppdatera komponenten när den monteras
  useEffect(() => {
    // Detta kommer att tvinga en omrendering av ArticleList
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Button 
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 mb-4"
      >
        Logga ut
      </Button>
      <div className="mb-4">
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
      </div>
      {activeTab === 'feedback' && <FeedbackList />}
      {activeTab === 'articles' && <ArticleList key={Date.now()} />}
    </div>
  )
}

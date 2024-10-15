'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FeedbackList } from '@/components/feedback-list'
import { useEffect } from 'react'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    console.log('AdminDashboard mounted')
  }, [])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  console.log('Rendering AdminDashboard')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Button 
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 mb-4"
      >
        Logga ut
      </Button>
      <div>
        <FeedbackList />
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { MessageSquarePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { createPortal } from 'react-dom'

interface FeedbackButtonProps {
  variant?: 'icon' | 'menu-item'
  className?: string
}

export function FeedbackButton({ variant = 'icon', className = '' }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Feedback submitted:', feedback)
    toast({
      title: "Tack för din feedback!",
      description: "Vi uppskattar dina synpunkter och kommer att granska dem.",
    })
    setFeedback('')
    setIsOpen(false)
  }

  const handleOpenFeedback = () => setIsOpen(true)

  const feedbackModal = (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Lämna feedback</h2>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Berätta för oss vad du tycker eller vilka funktioner du skulle vilja se..."
              className="min-h-[200px]"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Avbryt</Button>
              <Button type="submit">Skicka</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {variant === 'icon' ? (
        <Button
          onClick={handleOpenFeedback}
          className={`fixed bottom-4 right-4 z-50 shadow-lg hover:shadow-xl transition-all duration-300
                     rounded-full w-14 h-14 sm:w-16 sm:h-16
                     flex items-center justify-center ${className}`}
        >
          <MessageSquarePlus className="w-7 h-7 sm:w-8 sm:h-8" />
        </Button>
      ) : (
        <Button onClick={handleOpenFeedback} className={`w-full justify-center py-6 ${className}`}>
          <MessageSquarePlus className="mr-2 h-5 w-5" />
          <span>Lämna feedback</span>
        </Button>
      )}

      {mounted && isOpen && createPortal(feedbackModal, document.body)}
    </>
  )
}

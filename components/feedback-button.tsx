'use client'

import { useState, useEffect, ReactNode } from 'react'
import { MessageSquarePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createPortal } from 'react-dom'
import { useToast } from '@/hooks/use-toast'

interface FeedbackButtonProps {
  variant: 'menu-item' | 'icon' | 'nav';
  children?: ReactNode;
}

export function FeedbackButton({ variant, children }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!feedback.trim()) {
      toast({
        title: 'Skriv något först',
        description: 'Feedbacken kan inte vara tom.',
      })
      return
    }
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: feedback }), // Changed 'feedback' to 'message'
      })

      if (response.ok) {
        await response.json()
        toast({
          title: 'Tack för din feedback!',
          description: 'Den hjälper till att göra verktyget bättre.',
        })
        setFeedback('')
        setIsOpen(false)
      } else {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Kunde inte skicka feedbacken')
      }
    } catch {
      toast({
        title: 'Det gick inte att skicka',
        description: 'Försök igen om en stund.',
      })
    }
  }

  const handleOpenFeedback = () => setIsOpen(true)

  const feedbackModal = (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card text-card-foreground shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Lämna feedback"
      >
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Lämna feedback</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Stäng">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Berätta vad du tycker eller vilka funktioner du saknar..."
              className="min-h-[160px]"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Avbryt</Button>
              <Button type="submit" disabled={!feedback.trim()}>Skicka</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {variant === 'icon' && (
        <div className="fixed bottom-4 right-4 z-[99999] hidden md:block">
          <Button
            onClick={handleOpenFeedback}
            className={`shadow-lg hover:shadow-xl transition-all duration-300
                       rounded-full w-14 h-14 sm:w-16 sm:h-16
                       flex items-center justify-center`}
          >
            <MessageSquarePlus className="w-7 h-7 sm:w-8 sm:h-8" />
          </Button>
        </div>
      )}
      {variant === 'menu-item' && (
        <Button onClick={handleOpenFeedback} variant="secondary" className="h-12 w-full justify-center">
          <MessageSquarePlus className="mr-2 h-5 w-5" />
          <span>{children}</span>
        </Button>
      )}
      {variant === 'nav' && (
        <Button
          onClick={handleOpenFeedback}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <MessageSquarePlus className="mr-1.5 h-4 w-4" />
          <span>{children}</span>
        </Button>
      )}

      {mounted && isOpen && createPortal(feedbackModal, document.body)}
    </>
  )
}

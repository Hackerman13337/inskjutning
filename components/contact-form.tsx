'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())

  useEffect(() => {
    setStartTime(Date.now())
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const endTime = Date.now()
    const timeDiff = endTime - startTime

    // Om formuläret fylls i på mindre än 5 sekunder, anta att det är en bot
    if (timeDiff < 5000) {
      console.log('Potentiell spambot detekterad')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      if (response.ok) {
        alert('Meddelande skickat!')
        setName('')
        setEmail('')
        setMessage('')
        setStartTime(Date.now()) // Återställ starttiden efter framgångsrik inlämning
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Det gick inte att skicka meddelandet. Försök igen senare.')
      }
    } catch (error) {
      console.error('Fel:', error)
      alert('Ett fel uppstod. Försök igen senare.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Namn"
        required
      />
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-post"
        required
      />
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Meddelande"
        required
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Skickar...' : 'Skicka'}
      </Button>
    </form>
  )
}

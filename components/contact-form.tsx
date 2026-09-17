'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  // Dolt fält. Människor ser det aldrig, bottar fyller i det.
  const [website, setWebsite] = useState('')

  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website }),
      })

      if (response.ok) {
        setStatus('sent')
        setName('')
        setEmail('')
        setMessage('')
        return
      }

      const data = await response.json().catch(() => null)
      setErrorMessage(data?.error ?? 'Det gick inte att skicka meddelandet. Försök igen senare.')
      setStatus('error')
    } catch {
      setErrorMessage('Ingen kontakt med servern. Kontrollera uppkopplingen och försök igen.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
          <Check className="h-6 w-6" strokeWidth={2.5} />
        </span>
        <p className="mt-4 font-semibold">Tack, meddelandet är skickat</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Jag återkommer så snart jag kan.
        </p>
        <Button variant="outline" className="mt-5" onClick={() => setStatus('idle')}>
          Skicka ett till
        </Button>
      </div>
    )
  }

  const isSending = status === 'sending'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="contact-name" className="stat-label">
          Namn
        </Label>
        <Input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ditt namn"
          autoComplete="name"
          maxLength={100}
          required
          className="mt-1.5 h-11"
        />
      </div>

      <div>
        <Label htmlFor="contact-email" className="stat-label">
          E-post
        </Label>
        <Input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="din@epost.se"
          autoComplete="email"
          maxLength={200}
          required
          className="mt-1.5 h-11"
        />
      </div>

      <div>
        <Label htmlFor="contact-message" className="stat-label">
          Meddelande
        </Label>
        <Textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Vad gäller det?"
          maxLength={3000}
          required
          className="mt-1.5 min-h-[140px]"
        />
      </div>

      {/* Honungsfällan — dold för användare, oemotståndlig för bottar. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Lämna detta fält tomt</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {status === 'error' && (
        <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={isSending} className="h-11 w-full">
        {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSending ? 'Skickar…' : 'Skicka'}
      </Button>
    </form>
  )
}

import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Hör av dig med frågor, önskemål eller felrapporter om inskjutningsverktyget.',
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-10 sm:py-14">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Kontakt</h1>
        <p className="mt-2 text-muted-foreground">
          Saknar du en funktion, hittat något som räknar fel, eller vill du bara höra av dig?
          Skriv några rader.
        </p>
      </header>

      <div className="field-card p-5 sm:p-6">
        <ContactForm />
      </div>
    </main>
  )
}

import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { clientIp, rateLimit } from '@/lib/rate-limit'

const MAX_NAME = 100
const MAX_EMAIL = 200
const MAX_MESSAGE = 3000

/** Enkel rimlighetskontroll — inte en fullständig e-postvalidering. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/**
 * Tar emot meddelanden från kontaktformuläret.
 *
 * Meddelandena hamnar i samma tabell som feedbacken, med en tydlig rubrik så
 * att de går att skilja åt i admin. Vill du ha en egen tabell senare är det
 * bara att byta ut insert-anropet här.
 */
export async function POST(request: Request) {
  const limit = rateLimit(`contact:${clientIp(request)}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  })

  if (!limit.ok) {
    return NextResponse.json(
      { error: 'För många meddelanden. Försök igen om en stund.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    )
  }

  try {
    const body = await request.json().catch(() => null)

    // Dolt fält som bara bottar fyller i.
    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      // Svara som om allt gick bra så att boten inte lär sig något.
      return NextResponse.json({ success: true })
    }

    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const message = typeof body?.message === 'string' ? body.message.trim() : ''

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Fyll i namn, e-post och meddelande.' }, { status: 400 })
    }

    if (name.length > MAX_NAME || email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
      return NextResponse.json({ error: 'Något av fälten är för långt.' }, { status: 400 })
    }

    if (!looksLikeEmail(email)) {
      return NextResponse.json({ error: 'E-postadressen ser inte riktig ut.' }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })
    const { error } = await supabase.from('feedback').insert([
      {
        message: `[Kontakt] ${name} <${email}>\n\n${message}`,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Kunde inte ta emot kontaktmeddelande:', error)
    return NextResponse.json({ error: 'Något gick fel. Försök igen senare.' }, { status: 500 })
  }
}

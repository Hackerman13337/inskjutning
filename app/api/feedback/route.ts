import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getAuthenticatedUser, unauthorized } from '@/lib/api-auth'
import { clientIp, rateLimit } from '@/lib/rate-limit'

const MAX_MESSAGE_LENGTH = 2000

/**
 * Läser inkommen feedback. Kräver inloggning — texterna innehåller ofta
 * kontaktuppgifter som folk skrivit i förtroende och ska inte ligga öppet.
 */
export async function GET() {
  const user = await getAuthenticatedUser()
  if (!user) return unauthorized()

  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    const transformedData = (data ?? []).map((item) => ({
      timestamp: item.created_at,
      content: item.message,
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Kunde inte hämta feedback:', error)
    return NextResponse.json({ error: 'Kunde inte hämta feedback' }, { status: 500 })
  }
}

/** Tar emot feedback från formuläret. Öppen väg, därav validering och spärr. */
export async function POST(request: Request) {
  const limit = rateLimit(`feedback:${clientIp(request)}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  })

  if (!limit.ok) {
    return NextResponse.json(
      { success: false, error: 'För många inskick. Försök igen om en stund.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    )
  }

  try {
    const body = await request.json().catch(() => null)
    const message = typeof body?.message === 'string' ? body.message.trim() : ''

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Meddelandet får inte vara tomt.' },
        { status: 400 }
      )
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Meddelandet får vara högst ${MAX_MESSAGE_LENGTH} tecken.` },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })
    const { error } = await supabase
      .from('feedback')
      .insert([{ message, created_at: new Date().toISOString() }])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Kunde inte spara feedback:', error)
    return NextResponse.json(
      { success: false, error: 'Något gick fel. Försök igen senare.' },
      { status: 500 }
    )
  }
}

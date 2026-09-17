import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'

/**
 * Hämtar den inloggade användaren för en API-väg.
 *
 * Använder getUser() och inte getSession(): getSession läser bara kakan och
 * litar på innehållet, medan getUser verifierar token mot Supabase. På servern
 * är det skillnaden mellan en riktig kontroll och en förfalskningsbar.
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data, error } = await supabase.auth.getUser()
    if (error) return null
    return data.user
  } catch {
    return null
  }
}

/** Svaret som skickas när någon försöker nå en skyddad väg utan att vara inloggad. */
export function unauthorized() {
  return NextResponse.json({ error: 'Kräver inloggning' }, { status: 401 })
}

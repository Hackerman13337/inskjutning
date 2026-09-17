import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/**
 * Skapar klienten först när den faktiskt används. Tidigare kastades ett fel redan
 * vid import, vilket gjorde att hela bygget föll om miljövariablerna saknades —
 * även för sidor som inte rör databasen.
 */
function getClient(): SupabaseClient {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Saknar NEXT_PUBLIC_SUPABASE_URL och/eller NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }

  client = createClient(url, anonKey)
  return client
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const instance = getClient()
    const value = Reflect.get(instance as object, prop, instance)
    return typeof value === 'function' ? value.bind(instance) : value
  },
})

/**
 * Enkel spärr mot översvämning av de öppna API-vägarna.
 *
 * Räknandet sker i minnet, vilket betyder att varje serverinstans har sin egen
 * räknare. På Vercel kan en beslutsam avsändare därför komma förbi genom att
 * träffa flera instanser. Det räcker gott mot vanliga spambottar, men behöver
 * bytas mot Vercel KV eller Upstash om det någon gång blir ett verkligt problem.
 */

interface RateLimitOptions {
  /** Antal tillåtna anrop inom fönstret. */
  limit: number
  /** Fönstrets längd i millisekunder. */
  windowMs: number
}

interface RateLimitResult {
  ok: boolean
  /** Sekunder kvar tills nästa försök tillåts. */
  retryAfterSeconds: number
}

const hitsByKey = new Map<string, number[]>()

/** Så många nycklar vi håller i minnet innan vi städar bort de utgångna. */
const MAX_KEYS = 5000

function prune(now: number, windowMs: number): void {
  const expired: string[] = []

  hitsByKey.forEach((hits: number[], key: string) => {
    const fresh = hits.filter((time) => now - time < windowMs)
    if (fresh.length === 0) expired.push(key)
    else hitsByKey.set(key, fresh)
  })

  expired.forEach((key) => hitsByKey.delete(key))
}

export function rateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now()

  if (hitsByKey.size > MAX_KEYS) prune(now, windowMs)

  const hits = (hitsByKey.get(key) ?? []).filter((time) => now - time < windowMs)

  if (hits.length >= limit) {
    hitsByKey.set(key, hits)
    const oldest = hits[0]
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
    }
  }

  hits.push(now)
  hitsByKey.set(key, hits)
  return { ok: true, retryAfterSeconds: 0 }
}

/**
 * Avsändarens IP-adress. Vercel sätter x-forwarded-for; först i listan är
 * klienten, resten är proxyer. Saknas den helt får alla dela på samma räknare,
 * vilket är strängare men aldrig läckande.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip')?.trim() || 'okänd'
}

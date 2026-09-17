/*
 * Service worker för Inskjutning.
 *
 * Mål: verktyget ska öppna och fungera fullt ut utan täckning på banan.
 * Beräkningarna körs ändå i webbläsaren — det enda som behövs offline är
 * sidan själv, dess JavaScript och ikonerna.
 *
 * Strategi:
 *  - Sidvisningar: nätverket först, cachen som reserv. Då ser du alltid en
 *    färsk sida när du har täckning, men slipper felmeddelande när du inte har.
 *  - Byggfiler under /_next/static: cachen först. Filnamnen innehåller en hash
 *    och ändras vid varje bygge, så en cachad fil kan aldrig bli inaktuell.
 *  - Bilder, ikoner och måltavlor: cachen först.
 *  - Andra domäner: aldrig cache. Spärren för /api och /admin står kvar även
 *    sedan de vägarna tagits bort, som skydd om något dynamiskt läggs till igen.
 */

const VERSION = 'v1'
const PAGE_CACHE = `inskjutning-sidor-${VERSION}`
const ASSET_CACHE = `inskjutning-filer-${VERSION}`
const CURRENT_CACHES = [PAGE_CACHE, ASSET_CACHE]

/** Sidor som sparas direkt vid installation. */
const PRECACHE_PAGES = ['/', '/maltavlor']

const ASSET_PREFIXES = ['/_next/static/', '/icons/', '/image/', '/maltavlor/', '/fonts/']

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PAGE_CACHE)
      // En sida som inte går att hämta ska inte stoppa installationen.
      await Promise.allSettled(PRECACHE_PAGES.map((url) => cache.add(new Request(url, { cache: 'reload' }))))
      await self.skipWaiting()
    })()
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      await Promise.all(
        names.filter((name) => !CURRENT_CACHES.includes(name)).map((name) => caches.delete(name))
      )
      await self.clients.claim()
    })()
  )
})

/** Låter sidan be en väntande version att ta över direkt. */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting()
})

function isAsset(url) {
  return ASSET_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))
}

function isBypassed(url) {
  return (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/_next/image') ||
    url.searchParams.has('_rsc')
  )
}

async function networkFirst(request) {
  const cache = await caches.open(PAGE_CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch (error) {
    const cached = (await cache.match(request)) || (await cache.match('/'))
    if (cached) return cached
    throw error
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSET_CACHE)
  const cached = await cache.match(request)
  if (cached) return cached

  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (isBypassed(url)) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }

  if (isAsset(url)) {
    event.respondWith(cacheFirst(request))
  }
})

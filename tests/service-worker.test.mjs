/**
 * Kör public/sw.js i en simulerad service worker-miljö och kontrollerar
 * att cachningen beter sig som tänkt. Ersätter det browsertest som inte går
 * att köra i förhandsvisningen.
 */
import vm from 'node:vm'
import fs from 'node:fs'

const source = fs.readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8')

let failures = 0
function check(name, condition) {
  console.log(`${condition ? '  ok  ' : ' FEL  '} ${name}`)
  if (!condition) failures++
}

/* --- Fejkad CacheStorage ------------------------------------------------- */
class FakeCache {
  constructor() { this.store = new Map() }
  // Cache API löser strängar som URL:er relativt workerns plats — gör likadant här.
  key(req) {
    const raw = typeof req === 'string' ? req : req.url
    return new URL(raw, self.location).href
  }
  async match(req) { return this.store.get(this.key(req)) }
  async put(req, res) { this.store.set(this.key(req), res) }
  async add(req) {
    const res = await fetchImpl(req)
    if (!res.ok) throw new Error('add misslyckades')
    this.store.set(this.key(req), res)
  }
}
const cacheStorage = new Map()
const caches = {
  async open(name) {
    if (!cacheStorage.has(name)) cacheStorage.set(name, new FakeCache())
    return cacheStorage.get(name)
  },
  async keys() { return [...cacheStorage.keys()] },
  async delete(name) { return cacheStorage.delete(name) },
}

/* --- Fejkat nätverk ------------------------------------------------------ */
let online = true
const networkCalls = []
async function fetchImpl(req) {
  const url = typeof req === 'string' ? req : req.url
  networkCalls.push(url)
  if (!online) throw new TypeError('offline')
  return new Response('svar för ' + url, { status: 200 })
}

/* --- Fejkad worker-miljö ------------------------------------------------- */
const handlers = {}
let skipWaitingCalled = false
let claimCalled = false
const self = {
  location: new URL('https://inskjutning.se/'),
  addEventListener: (type, fn) => { handlers[type] = fn },
  skipWaiting: async () => { skipWaitingCalled = true },
  clients: { claim: async () => { claimCalled = true } },
}

// I en riktig service worker löses relativa adresser mot workerns location.
// Node kräver absoluta adresser, så vi gör om dem här.
class WorkerRequest extends Request {
  constructor(input, init) {
    const url = typeof input === 'string' ? new URL(input, self.location).href : input
    super(url, init)
  }
}

const context = vm.createContext({ self, caches, fetch: fetchImpl, Request: WorkerRequest, Response, URL, console, Promise })
vm.runInContext(source, context)

check('lyssnar på install, activate och fetch', ['install', 'activate', 'fetch'].every((t) => handlers[t]))

/**
 * Inkommande förfrågningar i en service worker kan ha mode 'navigate', vilket
 * Nodes Request-konstruktor vägrar skapa. Vi använder ett enkelt objekt med de
 * fält som service workern faktiskt läser.
 */
function req(url, { method = 'GET', mode = 'no-cors' } = {}) {
  return { url, method, mode }
}

/** Kör en händelse och väntar in det som skickas till waitUntil/respondWith. */
async function dispatch(type, event) {
  let waited = null
  let responded = null
  const e = { ...event, waitUntil: (p) => { waited = p }, respondWith: (p) => { responded = p } }
  handlers[type](e)
  if (waited) await waited
  return { responded: responded ? await responded.then((r) => r, (err) => err) : null, calledRespondWith: responded !== null }
}

const run = async () => {
  /* Installation ska förcacha startsidan och måltavlorna. */
  await dispatch('install', {})
  const pageCache = await caches.open('inskjutning-sidor-v1')
  check('install förcachar /', !!(await pageCache.match('https://inskjutning.se/')))
  check('install förcachar /maltavlor', !!(await pageCache.match('https://inskjutning.se/maltavlor')))
  check('install anropar skipWaiting', skipWaitingCalled)

  /* Gammal cacheversion ska städas bort vid aktivering. */
  cacheStorage.set('inskjutning-sidor-v0', new FakeCache())
  await dispatch('activate', {})
  check('activate raderar gammal cacheversion', !cacheStorage.has('inskjutning-sidor-v0'))
  check('activate behåller nuvarande cache', cacheStorage.has('inskjutning-sidor-v1'))
  check('activate anropar clients.claim', claimCalled)

  /* Sidvisning offline ska falla tillbaka på cachen. */
  online = false
  const nav = await dispatch('fetch', {
    request: req('https://inskjutning.se/', { mode: 'navigate' }),
  })
  check('sidvisning offline besvaras från cachen', nav.responded instanceof Response && nav.responded.status === 200)

  /* Okänd sida offline ska falla tillbaka på startsidan. */
  const unknown = await dispatch('fetch', {
    request: req('https://inskjutning.se/kontakt', { mode: 'navigate' }),
  })
  check('okänd sida offline faller tillbaka på startsidan', unknown.responded instanceof Response)
  online = true

  /* Byggfiler: första gången från nätet, andra gången från cachen. */
  const assetUrl = 'https://inskjutning.se/_next/static/chunks/main-abc123.js'
  await dispatch('fetch', { request: req(assetUrl) })
  const before = networkCalls.length
  await dispatch('fetch', { request: req(assetUrl) })
  check('byggfil hämtas från cachen andra gången', networkCalls.length === before)

  /* API och admin ska aldrig cachas. */
  const api = await dispatch('fetch', { request: req('https://inskjutning.se/api/feedback') })
  check('API går förbi service workern', !api.calledRespondWith)
  const admin = await dispatch('fetch', {
    request: req('https://inskjutning.se/admin/dashboard', { mode: 'navigate' }),
  })
  check('admin går förbi service workern', !admin.calledRespondWith)

  /* Andra domäner (t.ex. Supabase, analytics) ska lämnas ifred. */
  const extern = await dispatch('fetch', { request: req('https://example.com/data.json') })
  check('andra domäner lämnas ifred', !extern.calledRespondWith)

  /* Sidnavigering i Next (RSC) ska inte cachas. */
  const rsc = await dispatch('fetch', { request: req('https://inskjutning.se/maltavlor?_rsc=abc') })
  check('RSC-anrop går förbi service workern', !rsc.calledRespondWith)

  /* POST ska aldrig fångas. */
  const post = await dispatch('fetch', { request: req('https://inskjutning.se/', { method: 'POST' }) })
  check('POST går förbi service workern', !post.calledRespondWith)

  console.log(failures === 0 ? '\nAlla kontroller gick igenom.' : `\n${failures} kontroll(er) misslyckades.`)
  process.exit(failures === 0 ? 0 : 1)
}

run()

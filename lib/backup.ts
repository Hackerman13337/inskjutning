/**
 * Säkerhetskopiering av vapenprofiler och inskjutningslogg.
 *
 * Allt i verktyget ligger i webbläsarens localStorage, som försvinner när man
 * byter telefon, rensar webbplatsdata eller — på iPhone — inte besökt sajten på
 * en vecka. Den här modulen gör det möjligt att lyfta ut allt till en fil och
 * läsa in det igen.
 *
 * Filen som läses in kommer utifrån och får aldrig litas på. Därför granskas
 * varje post för sig: fält med fel typ förkastas, tal utanför rimliga gränser
 * klipps, texter kortas och okända klickvärden faller tillbaka på standard.
 * Det som inte håller måttet hoppas över i stället för att välta importen.
 */

import type { LogEntry, WeaponProfile } from './storage'
import { CLICK_UNITS, DEFAULT_CLICK_UNIT_ID } from './ballistics'

export const BACKUP_FORMAT = 'inskjutning.se/backup'
export const BACKUP_VERSION = 1

/** Så många profiler respektive loggposter en inläsning som mest tar med. */
export const MAX_IMPORT_PROFILES = 200
export const MAX_IMPORT_LOG_ENTRIES = 2000
/** Så många skott en enskild loggpost får innehålla. */
const MAX_SHOTS_PER_ENTRY = 50

const MAX_NAME_LENGTH = 100
const MAX_NOTES_LENGTH = 300
const MAX_LABEL_LENGTH = 60

export interface Backup {
  format: string
  version: number
  exportedAt: string
  profiles: WeaponProfile[]
  log: LogEntry[]
}

export function createBackup(profiles: WeaponProfile[], log: LogEntry[]): Backup {
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    profiles,
    log,
  }
}

export function backupFilename(date: Date = new Date()): string {
  return `inskjutning-sakerhetskopia-${date.toISOString().slice(0, 10)}.json`
}

/* -------------------------------------------------------------------------- */
/*  Granskning av inläst innehåll                                             */
/* -------------------------------------------------------------------------- */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Text med trimning och längdgräns. Tom text ger null. */
function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim().slice(0, maxLength)
  return trimmed === '' ? null : trimmed
}

/** Tal inom givna gränser. Oändligheter och NaN förkastas. */
function cleanNumber(value: unknown, min: number, max: number): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  if (value < min || value > max) return null
  return value
}

function cleanIsoDate(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const time = Date.parse(value)
  if (Number.isNaN(time)) return null
  return new Date(time).toISOString()
}

const knownClickUnitIds = new Set([...CLICK_UNITS.map((unit) => unit.id), 'custom'])

function cleanProfile(value: unknown): WeaponProfile | null {
  if (!isRecord(value)) return null

  const id = cleanText(value.id, 64)
  const name = cleanText(value.name, MAX_NAME_LENGTH)
  if (!id || !name) return null

  // Ett okänt klickvärde skulle ge en tom meny — fall tillbaka på standard.
  const clickUnitId =
    typeof value.clickUnitId === 'string' && knownClickUnitIds.has(value.clickUnitId)
      ? value.clickUnitId
      : DEFAULT_CLICK_UNIT_ID

  const customCmAt100m = cleanNumber(value.customCmAt100m, 0.01, 100)

  return {
    id,
    name,
    notes: cleanText(value.notes, MAX_NOTES_LENGTH) ?? undefined,
    clickUnitId,
    customCmAt100m: clickUnitId === 'custom' ? customCmAt100m : null,
    defaultDistance: cleanNumber(value.defaultDistance, 1, 3000) ?? 100,
    desiredX: cleanNumber(value.desiredX, -500, 500) ?? 0,
    desiredY: cleanNumber(value.desiredY, -500, 500) ?? 0,
    createdAt: cleanIsoDate(value.createdAt) ?? new Date().toISOString(),
  }
}

function cleanShots(value: unknown): { x: number; y: number }[] {
  if (!Array.isArray(value)) return []

  const shots: { x: number; y: number }[] = []
  for (const raw of value.slice(0, MAX_SHOTS_PER_ENTRY)) {
    if (!isRecord(raw)) continue
    const x = cleanNumber(raw.x, -1000, 1000)
    const y = cleanNumber(raw.y, -1000, 1000)
    if (x === null || y === null) continue
    shots.push({ x, y })
  }
  return shots
}

function cleanLogEntry(value: unknown): LogEntry | null {
  if (!isRecord(value)) return null

  const id = cleanText(value.id, 64)
  const createdAt = cleanIsoDate(value.createdAt)
  const distance = cleanNumber(value.distance, 1, 3000)
  if (!id || !createdAt || distance === null) return null

  const horizontalClicks = cleanNumber(value.horizontalClicks, -10000, 10000)
  const verticalClicks = cleanNumber(value.verticalClicks, -10000, 10000)
  if (horizontalClicks === null || verticalClicks === null) return null

  return {
    id,
    profileId: cleanText(value.profileId, 64),
    profileName: cleanText(value.profileName, MAX_NAME_LENGTH) ?? 'Utan profil',
    createdAt,
    distance,
    clickUnitLabel: cleanText(value.clickUnitLabel, MAX_LABEL_LENGTH) ?? '',
    shots: cleanShots(value.shots),
    mpiX: cleanNumber(value.mpiX, -1000, 1000) ?? 0,
    mpiY: cleanNumber(value.mpiY, -1000, 1000) ?? 0,
    horizontalClicks: Math.round(horizontalClicks),
    verticalClicks: Math.round(verticalClicks),
    groupSizeCm: cleanNumber(value.groupSizeCm, 0, 1000),
    groupSizeMoa: cleanNumber(value.groupSizeMoa, 0, 1000),
    note: cleanText(value.note, MAX_NOTES_LENGTH) ?? undefined,
  }
}

export interface ParsedBackup {
  profiles: WeaponProfile[]
  log: LogEntry[]
  /** Poster som förkastades för att de inte gick att tolka. */
  discardedProfiles: number
  discardedLogEntries: number
}

export type ParseResult =
  | { ok: true; backup: ParsedBackup }
  | { ok: false; error: string }

export function parseBackup(text: string): ParseResult {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, error: 'Filen är inte en giltig säkerhetskopia.' }
  }

  if (!isRecord(raw)) {
    return { ok: false, error: 'Filen är inte en giltig säkerhetskopia.' }
  }

  if (raw.format !== BACKUP_FORMAT) {
    return {
      ok: false,
      error: 'Filen ser inte ut att komma från Inskjutning. Välj en fil du exporterat härifrån.',
    }
  }

  if (typeof raw.version === 'number' && raw.version > BACKUP_VERSION) {
    return {
      ok: false,
      error: 'Filen kommer från en nyare version av appen. Ladda om sidan och försök igen.',
    }
  }

  const rawProfiles = Array.isArray(raw.profiles) ? raw.profiles : []
  const rawLog = Array.isArray(raw.log) ? raw.log : []

  const profiles: WeaponProfile[] = []
  let discardedProfiles = 0
  for (const candidate of rawProfiles.slice(0, MAX_IMPORT_PROFILES)) {
    const profile = cleanProfile(candidate)
    if (profile) profiles.push(profile)
    else discardedProfiles++
  }

  const log: LogEntry[] = []
  let discardedLogEntries = 0
  for (const candidate of rawLog.slice(0, MAX_IMPORT_LOG_ENTRIES)) {
    const entry = cleanLogEntry(candidate)
    if (entry) log.push(entry)
    else discardedLogEntries++
  }

  if (profiles.length === 0 && log.length === 0) {
    return { ok: false, error: 'Säkerhetskopian innehåller inga vapen eller pass.' }
  }

  return { ok: true, backup: { profiles, log, discardedProfiles, discardedLogEntries } }
}

/* -------------------------------------------------------------------------- */
/*  Sammanslagning                                                            */
/* -------------------------------------------------------------------------- */

export interface MergeSummary {
  profiles: WeaponProfile[]
  log: LogEntry[]
  addedProfiles: number
  keptProfiles: number
  addedLogEntries: number
  keptLogEntries: number
  /** Loggposter som fick strykas för att taket nåddes. */
  trimmedLogEntries: number
}

/**
 * Lägger till det som saknas utan att röra det som redan finns. Poster med
 * samma id räknas som samma sak, och den befintliga vinner — en inläsning kan
 * därför aldrig skriva över något användaren har på plats.
 */
export function mergeBackup(
  current: { profiles: WeaponProfile[]; log: LogEntry[] },
  incoming: ParsedBackup,
  maxLogEntries: number
): MergeSummary {
  const existingProfileIds = new Set(current.profiles.map((profile) => profile.id))
  const newProfiles = incoming.profiles.filter((profile) => !existingProfileIds.has(profile.id))

  const existingLogIds = new Set(current.log.map((entry) => entry.id))
  const newLogEntries = incoming.log.filter((entry) => !existingLogIds.has(entry.id))

  const mergedLog = [...current.log, ...newLogEntries].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  )

  const trimmedLog = mergedLog.slice(0, maxLogEntries)

  return {
    profiles: [...current.profiles, ...newProfiles],
    log: trimmedLog,
    addedProfiles: newProfiles.length,
    keptProfiles: incoming.profiles.length - newProfiles.length,
    addedLogEntries: newLogEntries.length,
    keptLogEntries: incoming.log.length - newLogEntries.length,
    trimmedLogEntries: mergedLog.length - trimmedLog.length,
  }
}

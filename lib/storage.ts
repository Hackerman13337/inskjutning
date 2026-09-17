'use client'

/**
 * Lokal lagring av vapenprofiler och inskjutningslogg.
 * Allt sparas i webbläsaren (localStorage) — ingen inloggning, inget som lämnar mobilen.
 */

import { DEFAULT_CLICK_UNIT_ID } from './ballistics'

/** Så många pass loggen håller. Äldre poster faller bort när taket nås. */
export const MAX_LOG_ENTRIES = 100

const PROFILES_KEY = 'inskjutning.profiles.v1'
const ACTIVE_PROFILE_KEY = 'inskjutning.activeProfile.v1'
const LOG_KEY = 'inskjutning.log.v1'

export interface WeaponProfile {
  id: string
  name: string
  /** Fritext, t.ex. "Sauer 100 .308" eller "Zeiss V4 3-12x56". */
  notes?: string
  clickUnitId: string
  /** Används när clickUnitId === 'custom'. */
  customCmAt100m?: number | null
  /** Standardavstånd i meter som fylls i automatiskt. */
  defaultDistance: number
  /** Önskad träffpunkt på standardavståndet, cm (t.ex. 3 cm högt på 100 m). */
  desiredX: number
  desiredY: number
  createdAt: string
}

export interface LogEntry {
  id: string
  profileId: string | null
  profileName: string
  createdAt: string
  distance: number
  clickUnitLabel: string
  shots: { x: number; y: number }[]
  mpiX: number
  mpiY: number
  horizontalClicks: number
  verticalClicks: number
  groupSizeCm: number | null
  groupSizeMoa: number | null
  note?: string
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJSON(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* Lagringen kan vara full eller blockerad — appen fungerar ändå. */
  }
}

export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function createProfile(name: string): WeaponProfile {
  return {
    id: createId(),
    name,
    clickUnitId: DEFAULT_CLICK_UNIT_ID,
    customCmAt100m: null,
    defaultDistance: 100,
    desiredX: 0,
    desiredY: 0,
    createdAt: new Date().toISOString(),
  }
}

export function loadProfiles(): WeaponProfile[] {
  return readJSON<WeaponProfile[]>(PROFILES_KEY, [])
}

export function saveProfiles(profiles: WeaponProfile[]): void {
  writeJSON(PROFILES_KEY, profiles)
}

export function loadActiveProfileId(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(ACTIVE_PROFILE_KEY)
}

export function saveActiveProfileId(id: string | null): void {
  if (typeof window === 'undefined') return
  if (id) window.localStorage.setItem(ACTIVE_PROFILE_KEY, id)
  else window.localStorage.removeItem(ACTIVE_PROFILE_KEY)
}

export function loadLog(): LogEntry[] {
  return readJSON<LogEntry[]>(LOG_KEY, [])
}

export function saveLog(entries: LogEntry[]): void {
  writeJSON(LOG_KEY, entries)
}

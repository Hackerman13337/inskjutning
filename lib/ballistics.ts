/**
 * Beräkningar för inskjutning av kikarsikte.
 *
 * Konventioner som används i hela appen:
 *  - x  = horisontell avvikelse i cm, positivt = träffen sitter till HÖGER om riktpunkten
 *  - y  = vertikal avvikelse i cm, positivt = träffen sitter ÖVER riktpunkten
 *  - Klick anges alltid som den justering som ska göras på siktet, dvs. motsatt
 *    riktning mot avvikelsen. Positivt antal klick = HÖGER respektive UPP.
 */

/** 1 MOA (minute of angle) i cm på 100 meter. */
export const CM_PER_MOA_AT_100M = 2.908882
/** 1 MIL (milliradian) i cm på 100 meter. */
export const CM_PER_MIL_AT_100M = 10

export interface ClickUnit {
  id: string
  /** Kort etikett i menyn, t.ex. "1/4 MOA". */
  label: string
  /** Förklarande text, t.ex. "0,73 cm på 100 m". */
  hint: string
  /** Hur många cm ett klick flyttar träffpunkten på 100 meter. */
  cmAt100m: number
  group: 'MOA' | 'MIL' | 'CM'
}

export const CLICK_UNITS: ClickUnit[] = [
  { id: '1/8-moa', label: '1/8 MOA', hint: '0,36 cm på 100 m', cmAt100m: CM_PER_MOA_AT_100M / 8, group: 'MOA' },
  { id: '1/4-moa', label: '1/4 MOA', hint: '0,73 cm på 100 m', cmAt100m: CM_PER_MOA_AT_100M / 4, group: 'MOA' },
  { id: '1/3-moa', label: '1/3 MOA', hint: '0,97 cm på 100 m', cmAt100m: CM_PER_MOA_AT_100M / 3, group: 'MOA' },
  { id: '1/2-moa', label: '1/2 MOA', hint: '1,45 cm på 100 m', cmAt100m: CM_PER_MOA_AT_100M / 2, group: 'MOA' },
  { id: '1-moa', label: '1 MOA', hint: '2,91 cm på 100 m', cmAt100m: CM_PER_MOA_AT_100M, group: 'MOA' },
  { id: '0.05-mil', label: '0,05 MIL', hint: '0,5 cm på 100 m', cmAt100m: CM_PER_MIL_AT_100M * 0.05, group: 'MIL' },
  { id: '0.1-mil', label: '0,1 MIL', hint: '1 cm på 100 m', cmAt100m: CM_PER_MIL_AT_100M * 0.1, group: 'MIL' },
  { id: '1cm-100m', label: '1 cm / 100 m', hint: 'Vanligt på europeiska sikten', cmAt100m: 1, group: 'CM' },
  { id: '0.5cm-100m', label: '0,5 cm / 100 m', hint: 'Fint klick, 0,5 cm på 100 m', cmAt100m: 0.5, group: 'CM' },
  { id: '1.5cm-100m', label: '1,5 cm / 100 m', hint: 'Grovt klick, 1,5 cm på 100 m', cmAt100m: 1.5, group: 'CM' },
]

export const DEFAULT_CLICK_UNIT_ID = '1/4-moa'

export function findClickUnit(id: string): ClickUnit | undefined {
  return CLICK_UNITS.find((u) => u.id === id)
}

/** Löser upp ett klickvärde till cm/klick på 100 m, med stöd för eget värde. */
export function resolveCmAt100m(unitId: string, customCmAt100m?: number | null): number | null {
  if (unitId === 'custom') {
    return customCmAt100m && customCmAt100m > 0 ? customCmAt100m : null
  }
  return findClickUnit(unitId)?.cmAt100m ?? null
}

/** Hur många cm ett klick flyttar träffpunkten på det aktuella avståndet. */
export function cmPerClickAtDistance(cmAt100m: number, distanceMeters: number): number {
  return cmAt100m * (distanceMeters / 100)
}

export interface Shot {
  id: string
  /** cm, positivt = höger om riktpunkten */
  x: number
  /** cm, positivt = över riktpunkten */
  y: number
}

export interface GroupStats {
  /** Medelträffpunkt (mean point of impact) i cm. */
  mpi: { x: number; y: number }
  /** Största avståndet mellan två skott, cm (extreme spread). Null vid färre än 2 skott. */
  extremeSpreadCm: number | null
  /** Samma sak uttryckt i MOA på det aktuella avståndet. */
  extremeSpreadMoa: number | null
  /** Genomsnittligt avstånd från varje skott till medelträffpunkten, cm. */
  meanRadiusCm: number | null
  /** Avstånd från riktpunkt till medelträffpunkt, cm. */
  offsetCm: number
}

export function calculateGroupStats(shots: Shot[], distanceMeters: number): GroupStats | null {
  if (shots.length === 0) return null

  const mpi = {
    x: shots.reduce((sum, s) => sum + s.x, 0) / shots.length,
    y: shots.reduce((sum, s) => sum + s.y, 0) / shots.length,
  }

  let extremeSpreadCm: number | null = null
  if (shots.length >= 2) {
    let max = 0
    for (let i = 0; i < shots.length; i++) {
      for (let j = i + 1; j < shots.length; j++) {
        const d = Math.hypot(shots[i].x - shots[j].x, shots[i].y - shots[j].y)
        if (d > max) max = d
      }
    }
    extremeSpreadCm = max
  }

  const meanRadiusCm =
    shots.length >= 2
      ? shots.reduce((sum, s) => sum + Math.hypot(s.x - mpi.x, s.y - mpi.y), 0) / shots.length
      : null

  return {
    mpi,
    extremeSpreadCm,
    extremeSpreadMoa:
      extremeSpreadCm !== null && distanceMeters > 0
        ? cmToMoa(extremeSpreadCm, distanceMeters)
        : null,
    meanRadiusCm,
    offsetCm: Math.hypot(mpi.x, mpi.y),
  }
}

/** Omvandlar ett mått i cm på ett givet avstånd till MOA. */
export function cmToMoa(cm: number, distanceMeters: number): number {
  return cm / (CM_PER_MOA_AT_100M * (distanceMeters / 100))
}

/** Omvandlar ett mått i cm på ett givet avstånd till MIL (mrad). */
export function cmToMil(cm: number, distanceMeters: number): number {
  return cm / (CM_PER_MIL_AT_100M * (distanceMeters / 100))
}

export interface AdjustmentInput {
  shots: Shot[]
  distanceMeters: number
  cmAt100m: number
  /** Önskad träffpunkt i förhållande till riktpunkten, cm. Standard 0/0 (mitt i prick). */
  desiredX?: number
  desiredY?: number
}

export interface AdjustmentResult {
  /** Antal klick i sidled. Positivt = höger, negativt = vänster. */
  horizontalClicks: number
  /** Antal klick i höjdled. Positivt = upp, negativt = ner. */
  verticalClicks: number
  /** Exakt (oavrundat) antal klick, för att kunna visa hur nära man kommer. */
  exactHorizontalClicks: number
  exactVerticalClicks: number
  /** cm som ett klick flyttar träffpunkten på det aktuella avståndet. */
  cmPerClick: number
  /** Felet som återstår efter justeringen, i cm (avrundningsrest). */
  residualX: number
  residualY: number
  residualCm: number
  /** Hur mycket som ska korrigeras, i cm. */
  correctionX: number
  correctionY: number
  group: GroupStats
}

/**
 * Räknar ut hur många klick siktet ska vridas för att flytta medelträffpunkten
 * till önskad träffpunkt.
 */
export function calculateAdjustment(input: AdjustmentInput): AdjustmentResult | null {
  const { shots, distanceMeters, cmAt100m, desiredX = 0, desiredY = 0 } = input

  const group = calculateGroupStats(shots, distanceMeters)
  if (!group) return null
  if (!(distanceMeters > 0) || !(cmAt100m > 0)) return null

  const cmPerClick = cmPerClickAtDistance(cmAt100m, distanceMeters)

  // Så här mycket måste träffpunkten flyttas för att hamna rätt.
  const correctionX = desiredX - group.mpi.x
  const correctionY = desiredY - group.mpi.y

  const exactHorizontalClicks = correctionX / cmPerClick
  const exactVerticalClicks = correctionY / cmPerClick

  const horizontalClicks = Math.round(exactHorizontalClicks)
  const verticalClicks = Math.round(exactVerticalClicks)

  const residualX = correctionX - horizontalClicks * cmPerClick
  const residualY = correctionY - verticalClicks * cmPerClick

  return {
    horizontalClicks,
    verticalClicks,
    exactHorizontalClicks,
    exactVerticalClicks,
    cmPerClick,
    residualX,
    residualY,
    residualCm: Math.hypot(residualX, residualY),
    correctionX,
    correctionY,
    group,
  }
}

/** Formaterar ett tal med svenskt decimaltecken. */
export function formatNumber(value: number, decimals = 1): string {
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

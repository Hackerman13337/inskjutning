'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Crosshair,
  Layers,
  Pencil,
  RotateCcw,
  Save,
  SlidersHorizontal,
  Trash2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

import { TargetPlot } from '@/components/target-plot'
import { AdjustmentResultView } from '@/components/adjustment-result'
import { ShotLog } from '@/components/shot-log'
import { BackupPanel } from '@/components/backup-panel'

import {
  CLICK_UNITS,
  DEFAULT_CLICK_UNIT_ID,
  calculateAdjustment,
  findClickUnit,
  formatNumber,
  resolveCmAt100m,
  type Shot,
} from '@/lib/ballistics'
import {
  createId,
  createProfile,
  loadActiveProfileId,
  loadLog,
  loadProfiles,
  MAX_LOG_ENTRIES,
  saveActiveProfileId,
  saveLog,
  saveProfiles,
  type LogEntry,
  type WeaponProfile,
} from '@/lib/storage'

const DISTANCE_PRESETS = [25, 50, 80, 100, 150, 200]
const SCALE_STEPS = [5, 10, 20, 40, 80]
const MAX_SHOTS = 10

function parseNum(value: string): number {
  const parsed = parseFloat(value.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : NaN
}

/* -------------------------------------------------------------------------- */
/*  Fält för en avvikelse i cm med riktningsknappar                            */
/* -------------------------------------------------------------------------- */

interface SignedCmFieldProps {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  positive: { label: string; icon: React.ElementType }
  negative: { label: string; icon: React.ElementType }
  disabled?: boolean
}

function SignedCmField({
  id,
  label,
  value,
  onChange,
  positive,
  negative,
  disabled,
}: SignedCmFieldProps) {
  const [text, setText] = useState(() => (value === 0 ? '' : String(Math.abs(value))))
  const [sign, setSign] = useState<1 | -1>(value < 0 ? -1 : 1)

  // Synka fältet när värdet ändras utifrån, t.ex. när man drar skottet på tavlan.
  useEffect(() => {
    const shown = parseNum(text)
    const shownSigned = Number.isNaN(shown) ? 0 : shown * sign
    if (Math.abs(shownSigned - value) > 0.001) {
      setText(value === 0 ? '' : String(Math.abs(Math.round(value * 10) / 10)))
      if (value !== 0) setSign(value < 0 ? -1 : 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const commit = (nextText: string, nextSign: 1 | -1) => {
    const parsed = parseNum(nextText)
    onChange(Number.isNaN(parsed) ? 0 : Math.abs(parsed) * nextSign)
  }

  const DirectionButton = ({
    dir,
    config,
  }: {
    dir: 1 | -1
    config: { label: string; icon: React.ElementType }
  }) => {
    const Icon = config.icon
    const active = sign === dir
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setSign(dir)
          commit(text, dir)
        }}
        aria-pressed={active}
        className={cn(
          'flex h-9 flex-1 items-center justify-center gap-1 rounded-md text-xs font-semibold transition-colors disabled:opacity-50',
          active
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
        {config.label}
      </button>
    )
  }

  return (
    <div>
      <Label htmlFor={id} className="stat-label">
        {label}
      </Label>
      <div className="mt-1.5 space-y-1.5">
        <div className="relative">
          <Input
            id={id}
            inputMode="decimal"
            value={text}
            disabled={disabled}
            placeholder="0"
            onChange={(e) => {
              const next = e.target.value
              if (next === '' || /^\d*[.,]?\d*$/.test(next)) {
                setText(next)
                commit(next, sign)
              }
            }}
            className="h-11 pr-10 text-base font-semibold tabular"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
            cm
          </span>
        </div>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <DirectionButton dir={-1} config={negative} />
          <DirectionButton dir={1} config={positive} />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Huvudkomponent                                                            */
/* -------------------------------------------------------------------------- */

export function Calculator() {
  const [profiles, setProfiles] = useState<WeaponProfile[]>([])
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null)
  const [log, setLog] = useState<LogEntry[]>([])

  const [shots, setShots] = useState<Shot[]>([])
  const [activeShotId, setActiveShotId] = useState<string | null>(null)
  const [groupMode, setGroupMode] = useState(false)

  const [distance, setDistance] = useState('100')
  const [clickUnitId, setClickUnitId] = useState(DEFAULT_CLICK_UNIT_ID)
  const [customCm, setCustomCm] = useState('')
  const [desiredX, setDesiredX] = useState(0)
  const [desiredY, setDesiredY] = useState(0)

  const [scaleCm, setScaleCm] = useState(20)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [profileDialog, setProfileDialog] = useState<{ open: boolean; editing: WeaponProfile | null }>({
    open: false,
    editing: null,
  })
  const [draftName, setDraftName] = useState('')
  const [draftNotes, setDraftNotes] = useState('')

  /* ---------------------------- Ladda från mobilen --------------------------- */

  /** Fyller formuläret med en profils sparade inställningar. */
  const applyProfileSettings = useCallback((profile: WeaponProfile) => {
    setClickUnitId(profile.clickUnitId)
    setCustomCm(profile.customCmAt100m ? String(profile.customCmAt100m) : '')
    setDistance(String(profile.defaultDistance))
    setDesiredX(profile.desiredX)
    setDesiredY(profile.desiredY)
  }, [])

  useEffect(() => {
    const storedProfiles = loadProfiles()
    const storedActive = loadActiveProfileId()
    setProfiles(storedProfiles)
    setLog(loadLog())

    const active = storedProfiles.find((p) => p.id === storedActive) ?? null
    if (active) {
      setActiveProfileId(active.id)
      applyProfileSettings(active)
    }
  }, [applyProfileSettings])

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) ?? null,
    [profiles, activeProfileId]
  )

  /** Sparar en ändring på den aktiva profilen så inställningarna finns kvar nästa gång. */
  const patchActiveProfile = useCallback(
    (patch: Partial<WeaponProfile>) => {
      setProfiles((prev) => {
        if (!activeProfileId) return prev
        const next = prev.map((p) => (p.id === activeProfileId ? { ...p, ...patch } : p))
        saveProfiles(next)
        return next
      })
    },
    [activeProfileId]
  )

  /* -------------------------------- Beräkning ------------------------------- */

  const distanceValue = parseNum(distance)
  const cmAt100m = resolveCmAt100m(clickUnitId, parseNum(customCm))
  const clickUnitLabel =
    clickUnitId === 'custom'
      ? `${formatNumber(parseNum(customCm) || 0, 2)} cm/klick @ 100 m`
      : (findClickUnit(clickUnitId)?.label ?? '')

  const result = useMemo(() => {
    if (shots.length === 0 || !Number.isFinite(distanceValue) || !cmAt100m) return null
    return calculateAdjustment({
      shots,
      distanceMeters: distanceValue,
      cmAt100m,
      desiredX,
      desiredY,
    })
  }, [shots, distanceValue, cmAt100m, desiredX, desiredY])

  const mpi = result?.group.mpi ?? (shots[0] ? { x: shots[0].x, y: shots[0].y } : null)
  const activeShot = shots.find((s) => s.id === activeShotId) ?? shots[0] ?? null

  /* ------------------------------ Skotthantering ---------------------------- */

  const clamp = useCallback((v: number) => Math.max(-scaleCm, Math.min(scaleCm, v)), [scaleCm])

  const handleAddShot = useCallback(
    (x: number, y: number) => {
      const shot: Shot = { id: createId(), x: clamp(x), y: clamp(y) }
      setShots((prev) => {
        if (!groupMode) return [shot]
        if (prev.length >= MAX_SHOTS) return prev
        return [...prev, shot]
      })
      setActiveShotId(shot.id)
    },
    [groupMode, clamp]
  )

  const handleMoveShot = useCallback(
    (id: string, x: number, y: number) => {
      setShots((prev) => prev.map((s) => (s.id === id ? { ...s, x: clamp(x), y: clamp(y) } : s)))
    },
    [clamp]
  )

  const updateActiveShot = (axis: 'x' | 'y', value: number) => {
    if (!activeShot) {
      const shot: Shot = { id: createId(), x: axis === 'x' ? value : 0, y: axis === 'y' ? value : 0 }
      setShots([shot])
      setActiveShotId(shot.id)
      return
    }
    setShots((prev) =>
      prev.map((s) => (s.id === activeShot.id ? { ...s, [axis]: value } : s))
    )
  }

  const removeShot = (id: string) => {
    setShots((prev) => prev.filter((s) => s.id !== id))
    if (activeShotId === id) setActiveShotId(null)
  }

  const resetShots = () => {
    setShots([])
    setActiveShotId(null)
  }

  const toggleGroupMode = (next: boolean) => {
    setGroupMode(next)
    if (!next) {
      // Behåll medelträffpunkten som ett enda skott när man går tillbaka.
      if (shots.length > 1 && mpi) {
        const shot: Shot = { id: createId(), x: Math.round(mpi.x * 10) / 10, y: Math.round(mpi.y * 10) / 10 }
        setShots([shot])
        setActiveShotId(shot.id)
      }
    }
  }

  /* -------------------------------- Profiler -------------------------------- */

  const selectProfile = (id: string) => {
    if (id === '__new__') {
      setDraftName('')
      setDraftNotes('')
      setProfileDialog({ open: true, editing: null })
      return
    }
    const profile = profiles.find((p) => p.id === id)
    if (!profile) return
    setActiveProfileId(profile.id)
    saveActiveProfileId(profile.id)
    applyProfileSettings(profile)
  }

  const saveProfileDialog = () => {
    const name = draftName.trim()
    if (!name) return

    if (profileDialog.editing) {
      const next = profiles.map((p) =>
        p.id === profileDialog.editing!.id ? { ...p, name, notes: draftNotes.trim() } : p
      )
      setProfiles(next)
      saveProfiles(next)
    } else {
      const profile: WeaponProfile = {
        ...createProfile(name),
        notes: draftNotes.trim(),
        clickUnitId,
        customCmAt100m: clickUnitId === 'custom' ? parseNum(customCm) : null,
        defaultDistance: Number.isFinite(distanceValue) ? distanceValue : 100,
        desiredX,
        desiredY,
      }
      const next = [...profiles, profile]
      setProfiles(next)
      saveProfiles(next)
      setActiveProfileId(profile.id)
      saveActiveProfileId(profile.id)
      toast({ title: 'Profil sparad', description: `${name} används nu.` })
    }
    setProfileDialog({ open: false, editing: null })
  }

  const deleteActiveProfile = () => {
    if (!activeProfile) return
    const next = profiles.filter((p) => p.id !== activeProfile.id)
    setProfiles(next)
    saveProfiles(next)
    setActiveProfileId(null)
    saveActiveProfileId(null)
    setProfileDialog({ open: false, editing: null })
  }

  /* ---------------------------------- Logg ---------------------------------- */

  const saveToLog = () => {
    if (!result) return
    const entry: LogEntry = {
      id: createId(),
      profileId: activeProfile?.id ?? null,
      profileName: activeProfile?.name ?? 'Utan profil',
      createdAt: new Date().toISOString(),
      distance: distanceValue,
      clickUnitLabel,
      shots: shots.map(({ x, y }) => ({ x, y })),
      mpiX: result.group.mpi.x,
      mpiY: result.group.mpi.y,
      horizontalClicks: result.horizontalClicks,
      verticalClicks: result.verticalClicks,
      groupSizeCm: result.group.extremeSpreadCm,
      groupSizeMoa: result.group.extremeSpreadMoa,
    }
    const next = [entry, ...log].slice(0, MAX_LOG_ENTRIES)
    setLog(next)
    saveLog(next)
    toast({
      title: 'Sparat i loggen',
      description: `${formatNumber(distanceValue, 0)} m · ${shots.length} skott`,
    })
  }

  const deleteLogEntry = (id: string) => {
    const next = log.filter((e) => e.id !== id)
    setLog(next)
    saveLog(next)
  }

  const clearLog = () => {
    setLog([])
    saveLog([])
  }

  /* --------------------------- Säkerhetskopiering --------------------------- */

  const handleImport = (nextProfiles: WeaponProfile[], nextLog: LogEntry[]) => {
    setProfiles(nextProfiles)
    saveProfiles(nextProfiles)
    setLog(nextLog)
    saveLog(nextLog)

    // Har användaren inget vapen valt är det inlästa rimligast att visa —
    // annars ser det ut som om ingenting hände.
    if (!activeProfileId && nextProfiles.length > 0) {
      const first = nextProfiles[0]
      setActiveProfileId(first.id)
      saveActiveProfileId(first.id)
      applyProfileSettings(first)
    }
  }

  /* ---------------------------------- Vy ------------------------------------ */

  const scaleIndex = SCALE_STEPS.indexOf(scaleCm)
  // Zooma inte in så hårt att ett inlagt skott hamnar utanför bilden.
  const nextZoomIn = SCALE_STEPS[Math.max(0, scaleIndex - 1)]
  const canZoomIn =
    scaleIndex > 0 && shots.every((s) => Math.abs(s.x) <= nextZoomIn && Math.abs(s.y) <= nextZoomIn)

  return (
    <div className="space-y-6">
      {/* Profilrad */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={activeProfileId ?? ''} onValueChange={selectProfile}>
          <SelectTrigger className="h-10 w-auto min-w-[180px] max-w-full gap-2 border-border bg-card font-medium">
            <Crosshair className="h-4 w-4 shrink-0 text-primary" />
            <SelectValue placeholder="Välj vapen" />
          </SelectTrigger>
          <SelectContent>
            {profiles.length > 0 && (
              <SelectGroup>
                <SelectLabel>Mina vapen</SelectLabel>
                {profiles.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
            <SelectGroup>
              <SelectItem value="__new__">+ Nytt vapen</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {activeProfile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground"
            aria-label="Redigera profil"
            onClick={() => {
              setDraftName(activeProfile.name)
              setDraftNotes(activeProfile.notes ?? '')
              setProfileDialog({ open: true, editing: activeProfile })
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}

        {activeProfile?.notes && (
          <span className="truncate text-sm text-muted-foreground">{activeProfile.notes}</span>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Vänsterkolumn: tavlan */}
        <section className="field-card overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-border p-3 sm:p-4">
            <div className="flex rounded-lg bg-muted p-1">
              <button
                type="button"
                onClick={() => toggleGroupMode(false)}
                aria-pressed={!groupMode}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                  !groupMode
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Crosshair className="hidden h-3.5 w-3.5 sm:block" />
                Ett skott
              </button>
              <button
                type="button"
                onClick={() => toggleGroupMode(true)}
                aria-pressed={groupMode}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                  groupMode
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Layers className="hidden h-3.5 w-3.5 sm:block" />
                Skottgrupp
              </button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Zooma in"
                disabled={!canZoomIn}
                onClick={() => setScaleCm(nextZoomIn)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Zooma ut"
                disabled={scaleIndex >= SCALE_STEPS.length - 1}
                onClick={() => setScaleCm(SCALE_STEPS[Math.min(SCALE_STEPS.length - 1, scaleIndex + 1)])}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                aria-label="Rensa skotten"
                disabled={shots.length === 0}
                onClick={resetShots}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-3 sm:p-4">
            <TargetPlot
              className="mx-auto max-w-[520px]"
              shots={shots}
              scaleCm={scaleCm}
              distanceMeters={distanceValue}
              desired={{ x: desiredX, y: desiredY }}
              activeShotId={activeShotId}
              singleShotMode={!groupMode}
              mpi={mpi}
              onAddShot={handleAddShot}
              onMoveShot={handleMoveShot}
              onSelectShot={setActiveShotId}
            />

            <p className="mt-3 text-center text-xs text-muted-foreground">
              {shots.length === 0
                ? 'Tryck på tavlan där kulan träffade — eller skriv in avvikelsen nedan.'
                : groupMode
                  ? `Tryck för att lägga till fler skott (${shots.length}/${MAX_SHOTS}). Dra i ett skott för att flytta det — zooma in om gruppen sitter tätt.`
                  : 'Dra skottet för att finjustera, eller ändra värdena nedan.'}
            </p>

            {groupMode && shots.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {shots.map((shot, i) => (
                  <span
                    key={shot.id}
                    className={cn(
                      'flex items-center rounded-full border pr-1 text-xs font-medium transition-colors tabular',
                      shot.id === activeShotId
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border text-muted-foreground hover:border-foreground/30'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveShotId(shot.id)}
                      className="flex items-center gap-1.5 py-1 pl-2.5 pr-1"
                      aria-pressed={shot.id === activeShotId}
                    >
                      <span className="font-semibold">{i + 1}</span>
                      <span>
                        {formatNumber(shot.x)} / {formatNumber(shot.y)}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeShot(shot.id)}
                      aria-label={`Ta bort skott ${i + 1}`}
                      className="rounded-full p-1 opacity-50 transition-opacity hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Finjustering med siffror */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <SignedCmField
                id="deviation-x"
                label={groupMode ? `Sida — skott ${Math.max(1, shots.findIndex((s) => s.id === activeShot?.id) + 1)}` : 'Sida'}
                value={activeShot?.x ?? 0}
                onChange={(v) => updateActiveShot('x', v)}
                negative={{ label: 'Vänster', icon: ArrowLeft }}
                positive={{ label: 'Höger', icon: ArrowRight }}
              />
              <SignedCmField
                id="deviation-y"
                label={groupMode ? `Höjd — skott ${Math.max(1, shots.findIndex((s) => s.id === activeShot?.id) + 1)}` : 'Höjd'}
                value={activeShot?.y ?? 0}
                onChange={(v) => updateActiveShot('y', v)}
                negative={{ label: 'Ner', icon: ArrowDown }}
                positive={{ label: 'Upp', icon: ArrowUp }}
              />
            </div>
          </div>
        </section>

        {/* Högerkolumn: inställningar och resultat */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section className="field-card space-y-4 p-4">
            {/* Avstånd */}
            <div>
              <Label htmlFor="distance" className="stat-label">
                Avstånd till tavlan
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="distance"
                  inputMode="decimal"
                  value={distance}
                  placeholder="100"
                  onChange={(e) => {
                    const next = e.target.value
                    if (next === '' || /^\d*[.,]?\d*$/.test(next)) {
                      setDistance(next)
                      const parsed = parseNum(next)
                      if (Number.isFinite(parsed)) patchActiveProfile({ defaultDistance: parsed })
                    }
                  }}
                  className="h-11 pr-10 text-base font-semibold tabular"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  m
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {DISTANCE_PRESETS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDistance(String(d))
                      patchActiveProfile({ defaultDistance: d })
                    }}
                    className={cn(
                      'rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors tabular',
                      distanceValue === d
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                    )}
                  >
                    {d} m
                  </button>
                ))}
              </div>
            </div>

            {/* Klickvärde */}
            <div>
              <Label htmlFor="click-unit" className="stat-label">
                Siktets klickvärde
              </Label>
              <Select
                value={clickUnitId}
                onValueChange={(value) => {
                  setClickUnitId(value)
                  patchActiveProfile({
                    clickUnitId: value,
                    customCmAt100m: value === 'custom' ? parseNum(customCm) : null,
                  })
                }}
              >
                <SelectTrigger id="click-unit" className="mt-1.5 h-11 font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>MOA</SelectLabel>
                    {CLICK_UNITS.filter((u) => u.group === 'MOA').map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.label} <span className="text-muted-foreground">· {u.hint}</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>MIL / MRAD</SelectLabel>
                    {CLICK_UNITS.filter((u) => u.group === 'MIL').map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.label} <span className="text-muted-foreground">· {u.hint}</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Centimeter</SelectLabel>
                    {CLICK_UNITS.filter((u) => u.group === 'CM').map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.label} <span className="text-muted-foreground">· {u.hint}</span>
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Eget värde…</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {clickUnitId === 'custom' && (
                <div className="relative mt-2">
                  <Input
                    inputMode="decimal"
                    value={customCm}
                    placeholder="t.ex. 0,8"
                    onChange={(e) => {
                      const next = e.target.value
                      if (next === '' || /^\d*[.,]?\d*$/.test(next)) {
                        setCustomCm(next)
                        patchActiveProfile({ customCmAt100m: parseNum(next) })
                      }
                    }}
                    className="h-11 pr-28 text-base font-semibold tabular"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                    cm / klick @ 100 m
                  </span>
                </div>
              )}
            </div>

            {/* Avancerat: önskad träffpunkt */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg py-1 text-left"
              >
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Önskad träffpunkt
                </span>
                <span className="text-xs text-muted-foreground tabular">
                  {desiredX === 0 && desiredY === 0
                    ? 'Mitt i prick'
                    : `${formatNumber(desiredX)} / ${formatNumber(desiredY)} cm`}
                </span>
              </button>

              {showAdvanced && (
                <div className="mt-3 space-y-3 rounded-lg border border-border bg-surface/60 p-3 animate-fade-up">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Vill du att kulan ska träffa något annat än mitten? Skjuter du in på 100 m men
                    vill ha nollan längre bort lägger du in hur högt träffen ska sitta här.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <SignedCmField
                      id="desired-x"
                      label="Sida"
                      value={desiredX}
                      onChange={(v) => {
                        setDesiredX(v)
                        patchActiveProfile({ desiredX: v })
                      }}
                      negative={{ label: 'Vänster', icon: ArrowLeft }}
                      positive={{ label: 'Höger', icon: ArrowRight }}
                    />
                    <SignedCmField
                      id="desired-y"
                      label="Höjd"
                      value={desiredY}
                      onChange={(v) => {
                        setDesiredY(v)
                        patchActiveProfile({ desiredY: v })
                      }}
                      negative={{ label: 'Ner', icon: ArrowDown }}
                      positive={{ label: 'Upp', icon: ArrowUp }}
                    />
                  </div>
                  {(desiredX !== 0 || desiredY !== 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground"
                      onClick={() => {
                        setDesiredX(0)
                        setDesiredY(0)
                        patchActiveProfile({ desiredX: 0, desiredY: 0 })
                      }}
                    >
                      Återställ till mitt i prick
                    </Button>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="field-card p-4">
            <AdjustmentResultView
              result={result}
              distanceMeters={distanceValue}
              clickUnitLabel={clickUnitLabel}
              shotCount={shots.length}
            />

            {result && (
              <Button onClick={saveToLog} variant="outline" className="mt-4 h-11 w-full">
                <Save className="mr-2 h-4 w-4" />
                Spara i loggen
              </Button>
            )}
          </section>
        </div>
      </div>

      {/* Logg */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Inskjutningslogg</h2>
          {log.length > 0 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground tabular">
              {log.length}
            </span>
          )}
        </div>
        <ShotLog entries={log} onDelete={deleteLogEntry} onClear={clearLog} />
      </section>

      <BackupPanel profiles={profiles} log={log} onImport={handleImport} />

      {/* Profil-dialog */}
      <Dialog
        open={profileDialog.open}
        onOpenChange={(open) => setProfileDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>{profileDialog.editing ? 'Redigera vapen' : 'Nytt vapen'}</DialogTitle>
            <DialogDescription>
              Avstånd, klickvärde och önskad träffpunkt sparas automatiskt på profilen.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label htmlFor="profile-name" className="stat-label">
                Namn
              </Label>
              <Input
                id="profile-name"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="t.ex. Sauer 100 .308"
                className="mt-1.5 h-11"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="profile-notes" className="stat-label">
                Anteckning (valfritt)
              </Label>
              <Input
                id="profile-notes"
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                placeholder="t.ex. Zeiss V4 3-12x56, 1/4 MOA"
                className="mt-1.5 h-11"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            {profileDialog.editing ? (
              <Button variant="ghost" onClick={deleteActiveProfile} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Ta bort
              </Button>
            ) : (
              <span />
            )}
            <Button onClick={saveProfileDialog} disabled={!draftName.trim()}>
              Spara
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

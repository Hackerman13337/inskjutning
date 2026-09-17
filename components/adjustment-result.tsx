'use client'

import React from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AdjustmentResult } from '@/lib/ballistics'
import { cmToMoa, formatNumber } from '@/lib/ballistics'

interface AdjustmentResultViewProps {
  result: AdjustmentResult | null
  distanceMeters: number
  clickUnitLabel: string
  shotCount: number
}

interface AxisProps {
  axis: 'horizontal' | 'vertical'
  clicks: number
  correctionCm: number
}

function AxisCard({ axis, clicks, correctionCm }: AxisProps) {
  const isHorizontal = axis === 'horizontal'
  const none = clicks === 0

  const Icon = none
    ? Check
    : isHorizontal
      ? clicks > 0
        ? ArrowRight
        : ArrowLeft
      : clicks > 0
        ? ArrowUp
        : ArrowDown

  const direction = none
    ? 'Ingen justering'
    : isHorizontal
      ? clicks > 0
        ? 'Höger'
        : 'Vänster'
      : clicks > 0
        ? 'Upp'
        : 'Ner'

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-4 transition-colors sm:p-5',
        none
          ? 'border-success/35 bg-success/10'
          : 'border-primary/35 bg-primary/10'
      )}
    >
      <div className="stat-label">{isHorizontal ? 'Sida' : 'Höjd'}</div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-4xl font-bold leading-none tabular sm:text-5xl">
          {Math.abs(clicks)}
        </span>
        <span className="text-sm font-medium text-muted-foreground">klick</span>
      </div>

      <div
        className={cn(
          'mt-3 flex items-center gap-2 text-base font-semibold',
          none ? 'text-success' : 'text-primary'
        )}
      >
        <Icon className={cn('h-5 w-5 shrink-0', !none && 'animate-nudge-x')} strokeWidth={2.5} />
        <span>{direction}</span>
      </div>

      <div className="mt-1 text-xs text-muted-foreground tabular">
        {none
          ? 'Sitter redan inom ett klick'
          : `Flyttar träffpunkten ${formatNumber(Math.abs(correctionCm))} cm`}
      </div>
    </div>
  )
}

export function AdjustmentResultView({
  result,
  distanceMeters,
  clickUnitLabel,
  shotCount,
}: AdjustmentResultViewProps) {
  if (!result) {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
        <Target className="mb-3 h-8 w-8 text-muted-foreground/50" />
        <p className="text-sm font-medium text-muted-foreground">
          Markera var kulan träffade på tavlan
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Fyll i avstånd och klickvärde så räknas justeringen ut direkt.
        </p>
      </div>
    )
  }

  const { horizontalClicks, verticalClicks, cmPerClick, residualCm, group } = result
  const onTarget = horizontalClicks === 0 && verticalClicks === 0

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="grid grid-cols-2 gap-3">
        <AxisCard axis="horizontal" clicks={horizontalClicks} correctionCm={result.correctionX} />
        <AxisCard axis="vertical" clicks={verticalClicks} correctionCm={result.correctionY} />
      </div>

      {onTarget && (
        <div className="flex items-start gap-2 rounded-xl border border-success/35 bg-success/10 p-3 text-sm text-success">
          <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} />
          <p className="font-medium text-foreground">
            Siktet sitter rätt. Avvikelsen är mindre än ett klick — skjut en kontrollgrupp för att
            bekräfta.
          </p>
        </div>
      )}

      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border border-border bg-surface/60 p-4">
        <div>
          <dt className="stat-label">Ett klick</dt>
          <dd className="mt-0.5 text-sm font-semibold tabular">
            {formatNumber(cmPerClick, 2)} cm
          </dd>
          <dd className="text-[0.7rem] text-muted-foreground">
            på {formatNumber(distanceMeters, 0)} m · {clickUnitLabel}
          </dd>
        </div>

        <div>
          <dt className="stat-label">Kvar efter</dt>
          <dd className="mt-0.5 text-sm font-semibold tabular">
            {formatNumber(residualCm, 1)} cm
          </dd>
          <dd className="text-[0.7rem] text-muted-foreground">avrundning till hela klick</dd>
        </div>

        <div>
          <dt className="stat-label">Träffbild</dt>
          <dd className="mt-0.5 text-sm font-semibold tabular">
            {group.extremeSpreadCm !== null ? `${formatNumber(group.extremeSpreadCm)} cm` : '—'}
          </dd>
          <dd className="text-[0.7rem] text-muted-foreground">
            {group.extremeSpreadMoa !== null
              ? `${formatNumber(group.extremeSpreadMoa)} MOA · ${shotCount} skott`
              : 'minst 2 skott behövs'}
          </dd>
        </div>

        <div>
          <dt className="stat-label">Avvikelse</dt>
          <dd className="mt-0.5 text-sm font-semibold tabular">
            {formatNumber(group.offsetCm)} cm
          </dd>
          <dd className="text-[0.7rem] text-muted-foreground">
            {distanceMeters > 0
              ? `${formatNumber(cmToMoa(group.offsetCm, distanceMeters))} MOA från mitten`
              : 'från mitten'}
          </dd>
        </div>
      </dl>
    </div>
  )
}

'use client'

import React, { useCallback, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Shot } from '@/lib/ballistics'
import { cmToMoa, formatNumber } from '@/lib/ballistics'

interface TargetPlotProps {
  shots: Shot[]
  /** Halva bildens bredd i cm, dvs. tavlan visar ±scaleCm. */
  scaleCm: number
  distanceMeters: number
  /** Önskad träffpunkt i cm — normalt mitt i prick (0,0). */
  desired: { x: number; y: number }
  activeShotId: string | null
  /** True när bara ett skott ska hanteras: tryck flyttar skottet i stället för att lägga till fler. */
  singleShotMode: boolean
  mpi: { x: number; y: number } | null
  onAddShot: (x: number, y: number) => void
  onMoveShot: (id: string, x: number, y: number) => void
  onSelectShot: (id: string) => void
  className?: string
}

/** Avrundar till närmaste tiondels centimeter. */
function snap(value: number): number {
  return Math.round(value * 10) / 10
}

/** Väljer ett jämnt ringavstånd så att tavlan får 4–6 ringar oavsett zoom. */
function ringStep(scaleCm: number): number {
  const candidates = [0.5, 1, 2, 2.5, 5, 10, 20, 25, 50]
  const ideal = scaleCm / 4
  return candidates.reduce((best, c) =>
    Math.abs(c - ideal) < Math.abs(best - ideal) ? c : best
  )
}

export function TargetPlot({
  shots,
  scaleCm,
  distanceMeters,
  desired,
  activeShotId,
  singleShotMode,
  mpi,
  onAddShot,
  onMoveShot,
  onSelectShot,
  className,
}: TargetPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const draggingRef = useRef<string | null>(null)
  const [hoverCm, setHoverCm] = useState<{ x: number; y: number } | null>(null)

  const S = scaleCm
  const step = ringStep(S)
  const rings: number[] = []
  for (let r = step; r <= S * 1.42; r += step) rings.push(r)

  /** Skärmkoordinat → centimeter på tavlan (y positivt uppåt). */
  const clientToCm = useCallback(
    (clientX: number, clientY: number) => {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect || rect.width === 0) return { x: 0, y: 0 }
      const fx = (clientX - rect.left) / rect.width
      const fy = (clientY - rect.top) / rect.height
      return {
        x: snap(-S + fx * 2 * S),
        y: snap(S - fy * 2 * S),
      }
    },
    [S]
  )

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const target = e.target as Element
    const shotId = target.closest('[data-shot-id]')?.getAttribute('data-shot-id') ?? null
    const { x, y } = clientToCm(e.clientX, e.clientY)

    if (shotId) {
      draggingRef.current = shotId
      onSelectShot(shotId)
    } else if (singleShotMode && shots.length > 0) {
      draggingRef.current = shots[0].id
      onMoveShot(shots[0].id, x, y)
    } else {
      onAddShot(x, y)
      // Det nya skottet får dras direkt vidare av föräldern via activeShotId.
      draggingRef.current = 'pending'
    }
    svgRef.current?.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const { x, y } = clientToCm(e.clientX, e.clientY)
    setHoverCm({ x, y })
    const dragging = draggingRef.current
    if (!dragging) return
    const id = dragging === 'pending' ? activeShotId : dragging
    if (id) onMoveShot(id, x, y)
  }

  const endDrag = (e: React.PointerEvent<SVGSVGElement>) => {
    draggingRef.current = null
    if (svgRef.current?.hasPointerCapture(e.pointerId)) {
      svgRef.current.releasePointerCapture(e.pointerId)
    }
  }

  const shotRadius = S * 0.042
  const strokeThin = S * 0.004
  const strokeMed = S * 0.007

  return (
    <div className={cn('relative w-full', className)}>
      <svg
        ref={svgRef}
        viewBox={`${-S} ${-S} ${S * 2} ${S * 2}`}
        className="aspect-square w-full touch-none select-none rounded-2xl border border-border bg-[hsl(var(--target-face))] shadow-inner"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => setHoverCm(null)}
        role="application"
        aria-label="Måltavla — tryck där kulan träffade"
      >
        <defs>
          <radialGradient id="bullGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--target-bull))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(var(--target-bull))" stopOpacity="0" />
          </radialGradient>
          <clipPath id="plotClip">
            <rect x={-S} y={-S} width={S * 2} height={S * 2} rx={S * 0.06} />
          </clipPath>
        </defs>

        <g clipPath="url(#plotClip)">
          <circle cx={0} cy={0} r={step * 1.6} fill="url(#bullGlow)" />

          {/* Ringar med jämna centimeteravstånd */}
          {rings.map((r, i) => (
            <circle
              key={r}
              cx={0}
              cy={0}
              r={r}
              fill="none"
              stroke="hsl(var(--target-line))"
              strokeOpacity={i === 0 ? 0.9 : 0.45}
              strokeWidth={i === 0 ? strokeMed : strokeThin}
            />
          ))}

          {/* Hårkors */}
          <line x1={-S} y1={0} x2={S} y2={0} stroke="hsl(var(--target-line))" strokeWidth={strokeThin} strokeOpacity={0.8} />
          <line x1={0} y1={-S} x2={0} y2={S} stroke="hsl(var(--target-line))" strokeWidth={strokeThin} strokeOpacity={0.8} />

          {/* Centimeterstreck längs axlarna */}
          {rings.map((r) => (
            <g key={`ticks-${r}`} stroke="hsl(var(--target-line))" strokeWidth={strokeThin} strokeOpacity={0.9}>
              <line x1={r} y1={-S * 0.022} x2={r} y2={S * 0.022} />
              <line x1={-r} y1={-S * 0.022} x2={-r} y2={S * 0.022} />
              <line x1={-S * 0.022} y1={r} x2={S * 0.022} y2={r} />
              <line x1={-S * 0.022} y1={-r} x2={S * 0.022} y2={-r} />
            </g>
          ))}

          {/* Ringetiketter */}
          {rings.filter((r) => r <= S * 0.9).map((r) => (
            <text
              key={`label-${r}`}
              x={r}
              y={S * 0.075}
              textAnchor="middle"
              fill="hsl(var(--target-ink))"
              fillOpacity={0.55}
              fontSize={S * 0.055}
              className="tabular"
            >
              {formatNumber(r, r % 1 === 0 ? 0 : 1)}
            </text>
          ))}

          {/* Riktpunkten — mitten av tavlan */}
          <g pointerEvents="none" opacity={0.75}>
            <circle
              cx={0}
              cy={0}
              r={S * 0.012}
              fill="hsl(var(--target-ink))"
            />
          </g>

          {/* Önskad träffpunkt, om den inte är mitt i prick */}
          {(desired.x !== 0 || desired.y !== 0) && (
            <g>
              <circle
                cx={desired.x}
                cy={-desired.y}
                r={shotRadius * 1.25}
                fill="none"
                stroke="hsl(var(--success))"
                strokeWidth={strokeMed}
                strokeDasharray={`${S * 0.03} ${S * 0.022}`}
              />
              <text
                x={desired.x}
                y={-desired.y - shotRadius * 2}
                textAnchor="middle"
                fill="hsl(var(--success))"
                fontSize={S * 0.055}
                fontWeight={600}
              >
                mål
              </text>
            </g>
          )}

          {/* Korrektionspil från medelträffpunkt till önskad träffpunkt */}
          {mpi && Math.hypot(desired.x - mpi.x, desired.y - mpi.y) > S * 0.06 && (
            <line
              x1={mpi.x}
              y1={-mpi.y}
              x2={desired.x}
              y2={-desired.y}
              stroke="hsl(var(--primary))"
              strokeWidth={strokeMed}
              strokeOpacity={0.7}
              strokeDasharray={`${S * 0.035} ${S * 0.028}`}
            />
          )}

          {/* Skotten */}
          {shots.map((shot, index) => {
            const isActive = shot.id === activeShotId
            return (
              <g
                key={shot.id}
                data-shot-id={shot.id}
                className="cursor-grab active:cursor-grabbing"
                style={{ transformOrigin: `${shot.x}px ${-shot.y}px` }}
              >
                {/* Något större träffyta för fingret — men liten nog att man kan sätta
                    ett nytt skott tätt intill utan att råka greppa det förra. */}
                <circle cx={shot.x} cy={-shot.y} r={shotRadius * 1.8} fill="transparent" />
                {isActive && (
                  <circle
                    cx={shot.x}
                    cy={-shot.y}
                    r={shotRadius * 1.9}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth={strokeMed}
                    strokeOpacity={0.85}
                  />
                )}
                <circle
                  cx={shot.x}
                  cy={-shot.y}
                  r={shotRadius}
                  fill="hsl(var(--shot))"
                  stroke="hsl(var(--target-face))"
                  strokeWidth={strokeThin * 1.4}
                />
                {!singleShotMode && (
                  <text
                    x={shot.x}
                    y={-shot.y + shotRadius * 0.42}
                    textAnchor="middle"
                    fill="hsl(var(--target-face))"
                    fontSize={shotRadius * 1.15}
                    fontWeight={700}
                    pointerEvents="none"
                  >
                    {index + 1}
                  </text>
                )}
              </g>
            )
          })}

          {/* Medelträffpunkt när det finns en grupp */}
          {mpi && shots.length > 1 && (
            <g pointerEvents="none">
              <line
                x1={mpi.x - shotRadius * 1.5}
                y1={-mpi.y}
                x2={mpi.x + shotRadius * 1.5}
                y2={-mpi.y}
                stroke="hsl(var(--mpi))"
                strokeWidth={strokeMed}
              />
              <line
                x1={mpi.x}
                y1={-mpi.y - shotRadius * 1.5}
                x2={mpi.x}
                y2={-mpi.y + shotRadius * 1.5}
                stroke="hsl(var(--mpi))"
                strokeWidth={strokeMed}
              />
              <circle
                cx={mpi.x}
                cy={-mpi.y}
                r={shotRadius * 0.9}
                fill="none"
                stroke="hsl(var(--mpi))"
                strokeWidth={strokeMed}
              />
            </g>
          )}
        </g>
      </svg>

      {/* Avläsning i hörnet */}
      <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-background/80 px-2 py-1 text-[0.7rem] font-medium text-muted-foreground backdrop-blur-sm tabular">
        ±{formatNumber(S, 0)} cm
        {distanceMeters > 0 && (
          <span className="ml-1 opacity-70">· {formatNumber(cmToMoa(S, distanceMeters), 1)} MOA</span>
        )}
      </div>
      {hoverCm && (
        <div className="pointer-events-none absolute right-3 top-3 hidden rounded-lg bg-background/80 px-2 py-1 text-[0.7rem] font-medium text-muted-foreground backdrop-blur-sm tabular sm:block">
          {formatNumber(hoverCm.x)} · {formatNumber(hoverCm.y)} cm
        </div>
      )}
    </div>
  )
}

'use client'

import React from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/ballistics'
import type { LogEntry } from '@/lib/storage'

interface ShotLogProps {
  entries: LogEntry[]
  onDelete: (id: string) => void
  onClear: () => void
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }) +
    ' ' + d.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
}

function ClickBadge({ clicks, axis }: { clicks: number; axis: 'h' | 'v' }) {
  if (clicks === 0) {
    return <span className="text-muted-foreground">0</span>
  }
  const Icon = axis === 'h' ? (clicks > 0 ? ArrowRight : ArrowLeft) : clicks > 0 ? ArrowUp : ArrowDown
  return (
    <span className="inline-flex items-center gap-0.5 font-semibold tabular">
      {Math.abs(clicks)}
      <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
    </span>
  )
}

function toCsv(entries: LogEntry[]): string {
  const header = [
    'Datum', 'Profil', 'Avstånd (m)', 'Klickvärde', 'Antal skott',
    'MPI sida (cm)', 'MPI höjd (cm)', 'Klick sida', 'Klick höjd',
    'Gruppstorlek (cm)', 'Gruppstorlek (MOA)',
  ].join(';')

  const rows = entries.map((e) =>
    [
      e.createdAt,
      e.profileName,
      e.distance,
      e.clickUnitLabel,
      e.shots.length,
      e.mpiX.toFixed(2),
      e.mpiY.toFixed(2),
      e.horizontalClicks,
      e.verticalClicks,
      e.groupSizeCm !== null ? e.groupSizeCm.toFixed(2) : '',
      e.groupSizeMoa !== null ? e.groupSizeMoa.toFixed(2) : '',
    ].join(';')
  )

  return [header, ...rows].join('\n')
}

export function ShotLog({ entries, onDelete, onClear }: ShotLogProps) {
  const handleExport = () => {
    const blob = new Blob(['﻿' + toCsv(entries)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inskjutningslogg-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-center">
        <p className="text-sm font-medium text-muted-foreground">Loggen är tom</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Spara en beräkning så hamnar den här — praktiskt för att följa hur siktet vandrar
          mellan passen.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Exportera CSV
        </Button>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
          Töm loggen
        </Button>
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-center gap-3 p-3 sm:p-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="truncate text-sm font-semibold">{entry.profileName}</span>
                <span className="text-xs text-muted-foreground tabular">
                  {formatDate(entry.createdAt)}
                </span>
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground tabular">
                {formatNumber(entry.distance, 0)} m · {entry.clickUnitLabel} · {entry.shots.length}{' '}
                skott
                {entry.groupSizeCm !== null && ` · grupp ${formatNumber(entry.groupSizeCm)} cm`}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 text-sm">
              <div className="text-right">
                <div className="stat-label">Sida</div>
                <ClickBadge clicks={entry.horizontalClicks} axis="h" />
              </div>
              <div className="text-right">
                <div className="stat-label">Höjd</div>
                <ClickBadge clicks={entry.verticalClicks} axis="v" />
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(entry.id)}
              aria-label="Ta bort från loggen"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

'use client'

import React, { useRef, useState } from 'react'
import { AlertTriangle, Check, Download, ShieldCheck, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  backupFilename,
  createBackup,
  mergeBackup,
  parseBackup,
  type MergeSummary,
} from '@/lib/backup'
import { MAX_LOG_ENTRIES, type LogEntry, type WeaponProfile } from '@/lib/storage'

interface BackupPanelProps {
  profiles: WeaponProfile[]
  log: LogEntry[]
  onImport: (profiles: WeaponProfile[], log: LogEntry[]) => void
}

type Feedback =
  | { kind: 'none' }
  | { kind: 'error'; message: string }
  | { kind: 'imported'; summary: MergeSummary; discarded: number }
  | { kind: 'exported' }

/** "3 pass", "1 vapen" — så att texterna inte blir "1 pass:er". */
function count(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`
}

export function BackupPanel({ profiles, log, onImport }: BackupPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [feedback, setFeedback] = useState<Feedback>({ kind: 'none' })
  const [isBusy, setIsBusy] = useState(false)

  const isEmpty = profiles.length === 0 && log.length === 0

  const handleExport = async () => {
    setFeedback({ kind: 'none' })

    const json = JSON.stringify(createBackup(profiles, log), null, 2)
    const filename = backupFilename()

    // I en installerad app på iPhone fungerar inte vanlig nedladdning — där är
    // delningsrutan enda vägen ut till Filer, iCloud eller e-post.
    try {
      const file = new File([json], filename, { type: 'application/json' })
      if (typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Säkerhetskopia — Inskjutning' })
        setFeedback({ kind: 'exported' })
        return
      }
    } catch (error) {
      // Avbryter användaren delningsrutan är det inget fel att rapportera.
      if (error instanceof DOMException && error.name === 'AbortError') return
    }

    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
    setFeedback({ kind: 'exported' })
  }

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // Nollställ direkt så att samma fil går att välja igen.
    event.target.value = ''
    if (!file) return

    setIsBusy(true)
    setFeedback({ kind: 'none' })

    try {
      const text = await file.text()
      const parsed = parseBackup(text)

      if (!parsed.ok) {
        setFeedback({ kind: 'error', message: parsed.error })
        return
      }

      const summary = mergeBackup({ profiles, log }, parsed.backup, MAX_LOG_ENTRIES)
      onImport(summary.profiles, summary.log)
      setFeedback({
        kind: 'imported',
        summary,
        discarded: parsed.backup.discardedProfiles + parsed.backup.discardedLogEntries,
      })
    } catch {
      setFeedback({ kind: 'error', message: 'Filen kunde inte läsas. Försök välja den igen.' })
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <section className="field-card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ShieldCheck className="h-[1.15rem] w-[1.15rem]" />
        </span>
        <div className="min-w-0">
          <h2 className="font-semibold">Säkerhetskopiera</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Dina vapen och pass sparas bara i den här webbläsaren. De försvinner om du byter
            telefon eller rensar webbläsardata — och iPhone rensar själv efter en tid om du inte
            besöker sidan. Spara en fil då och då, så har du allt kvar.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleExport} disabled={isEmpty}>
          <Download className="mr-2 h-4 w-4" />
          Spara till fil
        </Button>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isBusy}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isBusy ? 'Läser in…' : 'Läs in fil'}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFile}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {isEmpty && (
        <p className="mt-3 text-xs text-muted-foreground">
          Det finns inget att spara än. Lägg upp ett vapen eller spara ett pass i loggen först.
        </p>
      )}

      {feedback.kind !== 'none' && (
        <div
          role="status"
          className={cn(
            'mt-4 flex items-start gap-2 rounded-xl border p-3 text-sm animate-fade-up',
            feedback.kind === 'error'
              ? 'border-destructive/40 bg-destructive/10'
              : 'border-success/35 bg-success/10'
          )}
        >
          {feedback.kind === 'error' ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          ) : (
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2.5} />
          )}

          <div className="min-w-0">
            {feedback.kind === 'error' && <p>{feedback.message}</p>}

            {feedback.kind === 'exported' && (
              <p>
                Säkerhetskopian innehåller {count(profiles.length, 'vapen', 'vapen')} och{' '}
                {count(log.length, 'pass', 'pass')}. Spara filen någonstans du hittar den igen.
              </p>
            )}

            {feedback.kind === 'imported' && (
              <>
                <p className="font-medium">
                  {feedback.summary.addedProfiles === 0 && feedback.summary.addedLogEntries === 0
                    ? 'Allt i filen fanns redan'
                    : `Läste in ${count(feedback.summary.addedProfiles, 'nytt vapen', 'nya vapen')} och ${count(feedback.summary.addedLogEntries, 'nytt pass', 'nya pass')}`}
                </p>

                {(feedback.summary.keptProfiles > 0 || feedback.summary.keptLogEntries > 0) && (
                  <p className="mt-1 text-muted-foreground">
                    {count(
                      feedback.summary.keptProfiles + feedback.summary.keptLogEntries,
                      'post',
                      'poster'
                    )}{' '}
                    fanns redan och lämnades orörda.
                  </p>
                )}

                {feedback.summary.trimmedLogEntries > 0 && (
                  <p className="mt-1 text-muted-foreground">
                    Loggen rymmer {MAX_LOG_ENTRIES} pass, så{' '}
                    {count(feedback.summary.trimmedLogEntries, 'äldre pass', 'äldre pass')} fick
                    strykas.
                  </p>
                )}

                {feedback.discarded > 0 && (
                  <p className="mt-1 text-muted-foreground">
                    {count(feedback.discarded, 'post', 'poster')} i filen gick inte att tolka och
                    hoppades över.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

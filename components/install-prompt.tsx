'use client'

import { useEffect, useState } from 'react'
import { Download, Share, SquarePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const DISMISSED_KEY = 'inskjutning.installTip.dismissed'
/** Låt användaren se sidan först — tipset dyker upp efter en liten stund. */
const SHOW_AFTER_MS = 4000

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type Mode = 'none' | 'install' | 'ios'

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS använder sin egen flagga i stället för display-mode.
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent

  // iPad med iPadOS 13+ utger sig för att vara en Mac. Pekskärmen avslöjar den.
  const iPadOS = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1
  const iOS = /iPad|iPhone|iPod/.test(ua) || iPadOS

  // Chrome, Firefox och Edge på iOS kan inte lägga till på hemskärmen.
  const safari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)

  return iOS && safari
}

export function InstallPrompt() {
  const [mode, setMode] = useState<Mode>('none')
  const [visible, setVisible] = useState(false)
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (isStandalone()) return

    let dismissed = false
    try {
      dismissed = window.localStorage.getItem(DISMISSED_KEY) === '1'
    } catch {
      /* Blockerad lagring — visa tipset ändå. */
    }
    if (dismissed) return

    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
      setMode('install')
    }

    const onInstalled = () => {
      setVisible(false)
      setMode('none')
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    // Safari på iPhone skickar aldrig något event — där får vi visa vägen själva.
    if (isIosSafari()) setMode('ios')

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  useEffect(() => {
    if (mode === 'none') return
    const timer = window.setTimeout(() => setVisible(true), SHOW_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [mode])

  const dismiss = () => {
    setVisible(false)
    try {
      window.localStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      /* Går inte att spara — tipset kommer tillbaka nästa besök. */
    }
  }

  const install = async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    dismiss()
  }

  if (mode === 'none') return null

  return (
    <div
      className={cn(
        'fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-md transition-all duration-300 sm:inset-x-4',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      )}
      role="complementary"
      aria-label="Installera appen"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 pr-10 shadow-xl">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Stäng"
          className="absolute right-2 top-2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Download className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <p className="text-sm font-semibold">Ha verktyget på hemskärmen</p>

            {mode === 'install' ? (
              <>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Öppnas som en egen app och fungerar även när du står utan täckning på banan.
                </p>
                <Button size="sm" className="mt-3 h-9" onClick={install}>
                  Installera
                </Button>
              </>
            ) : (
              <p className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-1 text-xs leading-relaxed text-muted-foreground">
                Tryck på
                <Share className="inline h-3.5 w-3.5 text-foreground" aria-label="Dela" />
                <span className="font-medium text-foreground">Dela</span>
                och välj
                <SquarePlus className="inline h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                <span className="font-medium text-foreground">Lägg till på hemskärmen</span>
                — då fungerar verktyget även utan täckning.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

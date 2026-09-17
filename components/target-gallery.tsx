'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Download, Info, Maximize2, Printer, Ruler } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export interface TargetSheet {
  name: string
  tagline: string
  description: string
  /** Hur långt från siktpunkten en träff får sitta och ändå hamna på rutnätet. */
  reach: string
  specs: string[]
  file: string
  preview: string
  /** Visas som varning på de blad som har flera små tavlor. */
  caveat?: string
}

interface TargetGalleryProps {
  targets: TargetSheet[]
}

const PREVIEW_WIDTH = 1131
const PREVIEW_HEIGHT = 1600

function DownloadButtons({ file }: { file: string }) {
  return (
    <>
      <Button asChild>
        <a href={`/maltavlor/${file}`} download>
          <Download className="mr-2 h-4 w-4" />
          Ladda ner
        </a>
      </Button>
      <Button asChild variant="outline">
        <a href={`/maltavlor/${file}`} target="_blank" rel="noopener noreferrer">
          <Printer className="mr-2 h-4 w-4" />
          Skriv ut
        </a>
      </Button>
    </>
  )
}

function Reach({ text }: { text: string }) {
  return (
    <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
      <Ruler className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60" />
      {text}
    </p>
  )
}

function Caveat({ text }: { text: string }) {
  return (
    <p className="mt-2 flex items-start gap-2 rounded-lg border border-border bg-surface/60 p-2.5 text-xs leading-relaxed text-muted-foreground">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60" />
      {text}
    </p>
  )
}

function Specs({ specs }: { specs: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-1.5">
      {specs.map((spec) => (
        <li
          key={spec}
          className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground tabular"
        >
          {spec}
        </li>
      ))}
    </ul>
  )
}

export function TargetGallery({ targets }: TargetGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const active = openIndex === null ? null : targets[openIndex]

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) =>
        current === null ? current : (current + delta + targets.length) % targets.length
      )
    },
    [targets.length]
  )

  // Piltangenter för att bläddra mellan tavlorna. Escape sköter Radix själv.
  useEffect(() => {
    if (openIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        step(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        step(-1)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openIndex, step])

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        {targets.map((target, index) => (
          <article key={target.file} className="field-card flex flex-col overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Visa ${target.name} större`}
              className="group relative flex justify-center border-b border-border bg-surface/60 p-5 transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <Image
                src={target.preview}
                alt={`Måltavlan ${target.name}`}
                width={PREVIEW_WIDTH}
                height={PREVIEW_HEIGHT}
                sizes="(max-width: 640px) 60vw, 240px"
                className="h-auto w-full max-w-[240px] rounded-lg border border-border bg-white shadow-sm transition-transform duration-200 group-hover:scale-[1.02]"
              />

              <span className="pointer-events-none absolute bottom-6 right-6 flex items-center gap-1.5 rounded-lg bg-background/90 px-2.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                <Maximize2 className="h-3.5 w-3.5" />
                Visa större
              </span>
            </button>

            <div className="flex flex-1 flex-col p-5">
              <div className="stat-label">{target.tagline}</div>
              <h2 className="mt-1 text-lg font-semibold">{target.name}</h2>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {target.description}
              </p>

              <Reach text={target.reach} />
              {target.caveat && <Caveat text={target.caveat} />}
              <Specs specs={target.specs} />

              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <DownloadButtons file={target.file} />
              </div>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent
          className="flex max-h-[95dvh] w-[calc(100vw-1.5rem)] max-w-5xl flex-col gap-0 overflow-y-auto p-0 sm:w-[calc(100vw-4rem)] sm:rounded-2xl lg:flex-row lg:overflow-hidden"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          {active && (
            <>
              {/*
                Tavlorna är stående A4. I ett liggande fönster är höjden det som
                begränsar, så på breda skärmar ligger texten vid sidan och bilden
                får hela höjden i stället för att klämmas ihop under en rubrik.
              */}
              <div className="flex shrink-0 items-center justify-center bg-surface/60 p-3 sm:p-5 lg:min-h-0 lg:flex-1 lg:shrink">
                <div
                  className="relative w-full max-w-[calc(58dvh_*_0.707)] sm:max-w-[calc(60dvh_*_0.707)] lg:max-w-[calc(82dvh_*_0.707)]"
                  style={{ aspectRatio: `${PREVIEW_WIDTH} / ${PREVIEW_HEIGHT}` }}
                >
                  <Image
                    key={active.file}
                    src={active.preview}
                    alt={`Måltavlan ${active.name} i full storlek`}
                    fill
                    sizes="(max-width: 1024px) 80vw, 640px"
                    className="rounded-lg border border-border bg-white object-contain shadow-md"
                    priority
                  />
                </div>
              </div>

              <div className="flex w-full shrink-0 flex-col overflow-y-auto border-t border-border p-4 pr-12 sm:p-5 sm:pr-14 lg:w-[300px] lg:border-l lg:border-t-0">
                <div className="stat-label">{active.tagline}</div>
                <DialogTitle className="mt-0.5 text-lg font-semibold">{active.name}</DialogTitle>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {active.description}
                </p>

                <Reach text={active.reach} />
                {active.caveat && <Caveat text={active.caveat} />}
                <Specs specs={active.specs} />

                <div className="mt-5 flex flex-wrap gap-2 lg:mt-auto lg:pt-5">
                  <DownloadButtons file={active.file} />
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  Skriv ut i skala 100 %. Kontrollmåttet i nederkanten ska mäta 10 cm.
                </p>

                {targets.length > 1 && (
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => step(-1)}
                      aria-label="Föregående måltavla"
                      className="text-muted-foreground"
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Förra
                    </Button>
                    <span className="text-xs text-muted-foreground tabular">
                      {(openIndex ?? 0) + 1} / {targets.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => step(1)}
                      aria-label="Nästa måltavla"
                      className="text-muted-foreground"
                    >
                      Nästa
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

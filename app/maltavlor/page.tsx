import type { Metadata } from 'next'
import { Download, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TargetGallery, type TargetSheet } from '@/components/target-gallery'

export const metadata: Metadata = {
  title: 'Måltavlor att skriva ut',
  description:
    'Fyra måltavlor i A4 med centimeterrutnät för inskjutning av kikarsiktet — precision, jakt, fyra grupper och sex små. Gratis att ladda ner och skriva ut.',
}

const targets: TargetSheet[] = [
  {
    name: 'Precision',
    tagline: 'Kikarsikte från bänk',
    description:
      'Finmaskigt rutnät över hela bladet och en öppen siktpunkt som lämnar mitten fri. Du ser hålen och kan mäta dem exakt — det är hela poängen med en rutnätstavla.',
    reach: 'Mäter träffar upp till 9 cm i sidled och 11 cm i höjd',
    specs: ['1 × 1 cm rutor', '18 × 22 cm rutnät', 'Siktpunkt 24 mm'],
    file: 'maltavla-precision-a4.pdf',
    preview: '/maltavlor/maltavla-precision-a4.png',
  },
  {
    name: 'Jakt',
    tagline: 'Öppna sikten och skymning',
    description:
      'Stor svart siktpunkt som syns genom öppna sikten och i dåligt ljus. Rutnätet fortsätter i vitt inne i svarta, så även en träff mitt i prick går att mäta.',
    reach: 'Mäter träffar upp till 8 cm i sidled och 10 cm i höjd',
    specs: ['2 × 2 cm rutor', '16 × 20 cm rutnät', 'Svart siktpunkt 6 cm'],
    file: 'maltavla-jakt-a4.pdf',
    preview: '/maltavlor/maltavla-jakt-a4.png',
  },
  {
    name: 'Fyra grupper',
    tagline: 'Jämför ammunition eller justeringar',
    description:
      'Fyra numrerade tavlor på ett blad, var och en med eget rutnät. Skjut en grupp per sort eller en efter varje justering utan att springa fram och byta tavla.',
    reach: 'Mäter träffar upp till 4 cm i sidled och 5 cm i höjd',
    specs: ['1 × 1 cm rutor', 'Fyra tavlor om 8 × 10 cm', 'Numrerade 1–4'],
    caveat:
      'Inte för första inskjutningen — en träff som sitter mer än 5 cm fel hamnar utanför rutnätet.',
    file: 'maltavla-fyra-grupper-a4.pdf',
    preview: '/maltavlor/maltavla-fyra-grupper-a4.png',
  },
  {
    name: 'Sex små',
    tagline: '.22 och luftgevär',
    description:
      'Sex små tavlor för korta avstånd där grupperna är täta och man skjuter många serier. Finmaskigt rutnät och liten siktpunkt.',
    reach: 'Mäter träffar upp till 4 cm i sidled och 3 cm i höjd',
    specs: ['1 × 1 cm rutor', 'Sex tavlor om 8 × 6 cm', 'Siktpunkt 12 mm'],
    caveat: 'Bara för korta avstånd med redan hyfsat inskjutet vapen.',
    file: 'maltavla-sex-sma-a4.pdf',
    preview: '/maltavlor/maltavla-sex-sma-a4.png',
  },
]

const chooseGuide = [
  {
    q: 'Skjuter in från grunden',
    a: 'Precision eller Jakt. De använder hela bladet, så träffen hamnar på rutnätet även om siktet är riktigt fel från början.',
  },
  {
    q: 'Kontrollgrupp eller jämföra ammunition',
    a: 'Fyra grupper. Vapnet ska redan vara nära rätt — blocken är 8 × 10 cm.',
  },
  {
    q: '.22 eller luftgevär på kort håll',
    a: 'Sex små. Täta grupper och många serier på samma blad.',
  },
]

const printTips = [
  'Skriv ut i skala 100 %, inte "anpassa till sidan" — annars stämmer inte rutorna.',
  'Mät kontrollmåttet i nederkanten med en linjal. Är det inte exakt 10 cm är utskriften omskalad.',
  'Fäst tavlan plant. En tavla som buktar ger fel mått när du mäter träffen.',
  'Fyll i vapen, ammunition, avstånd och datum överst — praktiskt att spara tavlan efteråt.',
]

export default function MaltavlorPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Måltavlor</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Skriv ut, räkna rutorna från mitten till träffen och mata in centimetrarna i
          verktyget. Tryck på en tavla för att se den större.
        </p>
      </header>

      <div className="mx-auto mb-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
        <Ruler className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm leading-relaxed">
          <span className="font-semibold">Skriv ut i skala 100 %.</span>{' '}
          <span className="text-muted-foreground">
            Varje tavla har ett kontrollmått i nederkanten. Mäter det inte exakt 10 cm med
            linjal har skrivaren skalat om sidan, och då blir alla mått fel.
          </span>
        </p>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Vilken ska jag välja?</h2>
        <dl className="grid gap-3 sm:grid-cols-3">
          {chooseGuide.map((item) => (
            <div key={item.q} className="rounded-xl border border-border bg-card p-4">
              <dt className="text-sm font-semibold">{item.q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <TargetGallery targets={targets} />

      <section className="mt-10 rounded-2xl border border-border bg-surface/60 p-5">
        <h2 className="font-semibold">Tänk på när du skriver ut</h2>
        <ul className="mt-3 space-y-2">
          {printTips.map((tip) => (
            <li key={tip} className="flex gap-2.5 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {tip}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-border p-5">
        <div>
          <h2 className="text-sm font-semibold">Måltavla 1 — originalet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Den första tavlan från sajten, med 1 cm rutnät och grå siktpunkt.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          {/* Kopia med ASCII-namn. Originalfilen heter "Måltavla 1 - A4.pdf",
              och eftersom macOS lagrar å dekomponerat matchade adressen inte
              filen i produktionsbygget — länken gav 404. */}
          <a href="/maltavlor/maltavla-1-original-a4.pdf" download>
            <Download className="mr-2 h-3.5 w-3.5" />
            Ladda ner
          </a>
        </Button>
      </section>
    </main>
  )
}

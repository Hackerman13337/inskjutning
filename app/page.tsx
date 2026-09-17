import { Metadata } from 'next'
import { ArrowRight, Crosshair, MousePointerClick, Wrench } from 'lucide-react'
import Link from 'next/link'
import { Calculator } from '@/components/calculator'
import { JsonLd } from '@/components/JsonLd'
import { articles } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Inskjutningsverktyg — klick på kikarsiktet',
  description:
    'Markera var kulan träffade på tavlan och få direkt hur många klick du ska vrida siktet i höjd och sida. Stöd för skottgrupper, MOA, MIL och egna vapenprofiler.',
}

const steps = [
  {
    icon: Wrench,
    title: 'Ställ upp stadigt',
    body: 'Skjut från säckar eller bänkstöd på ett känt avstånd. Ostadigt stöd ger en spridning som inte har med siktet att göra.',
  },
  {
    icon: MousePointerClick,
    title: 'Markera träffen',
    body: 'Tryck på tavlan där kulan slog in — eller skriv in avvikelsen i centimeter. Lägg in flera skott så räknas medelträffpunkten ut.',
  },
  {
    icon: Crosshair,
    title: 'Vrid och kontrollera',
    body: 'Vrid rattarna det antal klick som visas och skjut ett kontrollskott. Ligger det rätt är du klar.',
  },
]

const faq = [
  {
    q: 'Vad betyder 1/4 MOA?',
    a: 'MOA är en vinkel — en minut av en grad. Ett klick på 1/4 MOA flyttar träffpunkten ungefär 0,73 cm på 100 meter, alltså cirka 0,36 cm på 50 meter och 1,45 cm på 200 meter. Klickvärdet står oftast på siktets rattar eller i manualen.',
  },
  {
    q: 'Varför blir det fler klick på korta avstånd?',
    a: 'Ett klick flyttar träffpunkten en fast vinkel, inte ett fast antal centimeter. På 50 meter flyttar klicket bara hälften så många centimeter som på 100 meter — därför krävs dubbelt så många klick för samma avvikelse i cm.',
  },
  {
    q: 'Ska jag skjuta ett skott eller en grupp?',
    a: 'Ett enskilt skott kan ljuga. Skjut helst tre skott och låt verktyget räkna ut medelträffpunkten — det är den du justerar mot. Verktyget visar också gruppens storlek i cm och MOA så du ser hur mycket av avvikelsen som är spridning.',
  },
  {
    q: 'Sparas mina vapen någonstans?',
    a: 'Profiler och logg sparas bara lokalt i din egen webbläsare. Ingenting skickas till någon server och du behöver inte skapa konto. Rensar du webbläsarens data försvinner de.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

const appJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Inskjutning',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  inLanguage: 'sv-SE',
  description:
    'Räknar om träffpunktens avvikelse till antal klick på kikarsiktets höjd- och sidoratt.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'SEK' },
}

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={appJsonLd} />
      <section className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Fungerar lika bra i mobilen på banan
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          Skjut in siktet på{' '}
          <span className="text-primary">rätt antal klick</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Markera var kulan träffade i förhållande till riktpunkten. Verktyget räknar om
          avvikelsen till klick på höjd- och sidoratten — direkt, medan du står kvar vid bänken.
        </p>
      </section>

      <Calculator />

      <section className="mt-16">
        <h2 className="text-center text-2xl font-semibold tracking-tight">Så gör du</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="field-card p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="h-[1.15rem] w-[1.15rem]" />
                </span>
                <span className="stat-label">Steg {i + 1}</span>
              </div>
              <h3 className="mt-3 font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-center text-2xl font-semibold tracking-tight">Guider</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
          Läs på innan du åker till banan, eller slå upp det du fastnar på när du står där.
        </p>

        <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
          {articles
            .filter((article) => article.published)
            .slice(0, 4)
            .map((article) => (
              <Link
                key={article.slug}
                href={`/artiklar/${article.slug}`}
                className="field-card flex items-start justify-between gap-3 p-4 transition-colors hover:bg-accent/40"
              >
                <span>
                  <span className="block font-medium">{article.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </span>
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
        </div>

        <p className="mt-4 text-center">
          <Link
            href="/artiklar"
            className="text-sm font-medium text-primary hover:underline"
          >
            Alla artiklar
          </Link>
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-center text-2xl font-semibold tracking-tight">Vanliga frågor</h2>
        <div className="mx-auto mt-6 max-w-3xl divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {faq.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-medium transition-colors hover:bg-accent/40 sm:p-5">
                {item.q}
                <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-4 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-5">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  )
}

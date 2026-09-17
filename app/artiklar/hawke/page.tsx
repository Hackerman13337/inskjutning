import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArticleLayout } from '@/components/article-layout'
import { getArticle } from '@/lib/articles'

const article = getArticle('hawke')!

export const metadata: Metadata = {
  title: article.metaTitle ?? article.title,
  description: article.description,
}

const steps = [
  'Ta ett stabilt stöd, gärna med ett skjutstöd eller sandsäckar.',
  'Skjut ett skott mot måltavlan.',
  'Mät avståndet från siktpunkten till träffpunkten.',
  'Fyll i avvikelsen i inskjutningsverktyget.',
  'Följ verktygets rekommendation för antal klick på siktet.',
  'Justera siktet enligt rekommendationen.',
  'Skjut igen för att verifiera justeringen.',
]

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Hur man ställer in ett Hawke-sikte',
  description: article.description,
  inLanguage: 'sv-SE',
  step: steps.map((text, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    text,
  })),
}

export default function HawkeArticle() {
  return (
    <ArticleLayout
      article={article}
      lead="Att ställa in ditt Hawke-sikte korrekt är avgörande för att uppnå maximal precision. Följ den här guiden och använd vårt inskjutningsverktyg för bästa resultat."
      extraJsonLd={howToJsonLd}
    >
      <Image
        src="/image/hawk-sikte.jpg"
        alt="Hawke kikarsikte monterat på ett vapen"
        width={800}
        height={400}
        className="not-prose mb-8 h-auto w-full rounded-2xl border border-border"
        priority
      />

      <h2>Steg för steg</h2>
      <ol>
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <p>
        Upprepa processen vid behov tills du är nöjd med precisionen. Kom ihåg att olika
        Hawke-modeller kan ha specifika egenskaper, så konsultera alltid manualen för din
        specifika modell för detaljerade instruktioner.
      </p>

      <h2>Hitta klickvärdet på ditt Hawke-sikte</h2>

      <p>
        Hawke tillverkar sikten med flera olika klickvärden. De vanligaste på jaktmodellerna är
        1/4 MOA, men det förekommer också 1/2 MOA och modeller i MIL. Värdet står tryckt på
        rattarna eller i manualen — och det är avgörande för hur många klick du ska vrida.
      </p>

      <p>
        Är du osäker på vad beteckningarna betyder, läs{' '}
        <Link href="/artiklar/moa-och-mil">vår genomgång av MOA och MIL</Link>. Där finns också
        en tabell över hur många centimeter ett klick flyttar träffpunkten på olika avstånd.
      </p>

      <h2>Använd våra specialdesignade måltavlor</h2>
      <p>
        För att göra inställningen av ditt Hawke-sikte ännu enklare och mer exakt rekommenderar
        vi att du använder våra{' '}
        <Link href="/maltavlor">specialdesignade måltavlor</Link>. De har centimeterrutnät som
        gör att du kan räkna rutor i stället för att mäta med linjal, och ett kontrollmått som
        avslöjar om utskriften skalats om.
      </p>

      <h2>Använd vårt inskjutningsverktyg</h2>
      <p>
        Vårt specialutvecklade <Link href="/">inskjutningsverktyg</Link> förenklar processen
        genom att beräkna exakt hur många klick du behöver justera ditt sikte. Det sparar tid och
        ammunition, samtidigt som det ökar precisionen.
      </p>

      <p>
        Vill du ha hela gången från monterat sikte till bekräftad nolla finns den i{' '}
        <Link href="/artiklar/skjuta-in-kikarsikte">guiden om att skjuta in kikarsiktet</Link>.
      </p>

      <h2>Vanliga frågor om Hawke-sikten</h2>

      <h3>Hur ofta bör jag justera mitt Hawke-sikte?</h3>
      <p>
        När du byter ammunition, slagit i kikarsiktet eller om du har tagit av siktet och
        monterat om det så måste du justera siktet igen. Mer om det i{' '}
        <Link href="/artiklar/kontrollera-infor-jakten">
          artikeln om kontroll före jakten
        </Link>
        .
      </p>

      <h3>Kan jag använda samma inställningar för olika ammunitionstyper?</h3>
      <p>Nej, olika ammunitionstyper kräver olika inställningar.</p>
    </ArticleLayout>
  )
}

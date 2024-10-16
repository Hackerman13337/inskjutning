import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Hur man ställer in ett Hawke-sikte - Enkel guide med inskjutningsverktyg',
  description: 'Lär dig hur du enkelt ställer in ditt Hawke-sikte med hjälp av vårt inskjutningsverktyg och specialdesignade måltavlor. Följ vår steg-för-steg guide för optimal precision.',
}

export default function HawkeArticle() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Hur man ställer in ett Hawke-sikte",
    "description": "Enkel guide för att ställa in ditt Hawke-sikte med hjälp av inskjutningsverktyg och specialdesignade måltavlor.",
    "step": [
      {
        "@type": "HowToStep",
        "text": "Ta ett stabilt stöd, gärna med ett skjutstöd eller sandsäckar."
      },
      {
        "@type": "HowToStep",
        "text": "Skjut ett skott mot måltavlan."
      },
      {
        "@type": "HowToStep",
        "text": "Mät avståndet från siktpunkten till träffpunkten."
      },
      {
        "@type": "HowToStep",
        "text": "Fyll i avvikelsen i inskjutningsverktyget."
      },
      {
        "@type": "HowToStep",
        "text": "Följ verktygets rekommendation för antal klick på siktet."
      },
      {
        "@type": "HowToStep",
        "text": "Justera siktet enligt rekommendationen."
      },
      {
        "@type": "HowToStep",
        "text": "Skjut igen för att verifiera justeringen."
      }
    ]
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <article className="max-w-2xl mx-auto py-8 px-4">
        <Image
          src="/image/hawk-sikte.jpg"
          alt="Hawke sikte"
          width={800}
          height={400}
          className="w-full h-auto mb-6 rounded-lg"
        />
        
        <h1 className="text-3xl font-bold mb-6">Hur man ställer in ett Hawke-sikte</h1>
        
        <p className="text-lg mb-4">
          Att ställa in ditt Hawke-sikte korrekt är avgörande för att uppnå maximal precision. 
          Följ denna enkla guide och använd vårt inskjutningsverktyg för bästa resultat.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Steg-för-steg guide</h2>
        <ol className="list-decimal pl-5 mb-6">
          <li className="mb-2">Ta ett stabilt stöd, gärna med ett skjutstöd eller sandsäckar.</li>
          <li className="mb-2">Skjut ett skott mot måltavlan.</li>
          <li className="mb-2">Mät avståndet från siktpunkten till träffpunkten.</li>
          <li className="mb-2">
            Fyll i avvikelsen i vårt{' '}
            <Link href="/" className="text-blue-600 hover:underline">
              inskjutningsverktyg
            </Link>
            .
          </li>
          <li className="mb-2">Följ verktygets rekommendation för antal klick på siktet.</li>
          <li className="mb-2">Justera siktet enligt rekommendationen.</li>
          <li className="mb-2">Skjut igen för att verifiera justeringen.</li>
        </ol>
        
        <p className="mb-6">
          Upprepa processen vid behov tills du är nöjd med precisionen. Kom ihåg att olika Hawke-modeller 
          kan ha specifika egenskaper, så konsultera alltid manualen för din specifika modell för detaljerade instruktioner.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Använd våra specialdesignade måltavlor</h2>
        <p className="mb-6">
          För att göra inställningen av ditt Hawke-sikte ännu enklare och mer exakt, rekommenderar vi att du använder 
          våra {' '}
          <Link href="/maltavlor" className="text-blue-600 hover:underline">
            specialdesignade måltavlor
          </Link>
          . Dessa måltavlor är utformade för att ge tydliga referenspunkter och underlätta mätningen av 
          avvikelser. De kan avsevärt förbättra din precision och göra hela processen smidigare.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Använd vårt inskjutningsverktyg</h2>
        <p className="mb-6">
          Vårt specialutvecklade inskjutningsverktyg förenklar processen genom att beräkna exakt hur många klick 
          du behöver justera ditt sikte. Det sparar tid och ammunition, samtidigt som det ökar precisionen.
        </p>
        
        <Link href="/" className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
          Gå till inskjutningsverktyget
        </Link>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Vanliga frågor om Hawke-sikten</h2>
        <dl>
          <dt className="font-semibold mt-4">Hur ofta bör jag justera mitt Hawke-sikte?</dt>
          <dd className="ml-4">När du byter ammunition, slagit i kikarsiktet eller om du har tagit av siktet och monterat om det så måste du justera siktet igen.</dd>
          
          <dt className="font-semibold mt-4">Kan jag använda samma inställningar för olika ammunitionstyper?</dt>
          <dd className="ml-4">Nej, olika ammunitionstyper kräver olika inställningar.</dd>
        </dl>
      </article>
    </>
  )
}

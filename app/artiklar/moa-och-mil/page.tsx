import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleLayout, Callout } from '@/components/article-layout'
import { getArticle } from '@/lib/articles'

const article = getArticle('moa-och-mil')!

export const metadata: Metadata = {
  title: article.metaTitle ?? article.title,
  description: article.description,
}

const DISTANCES = [25, 50, 100, 150, 200, 300]

/** cm per klick på 100 meter för varje klickvärde. */
const CLICK_VALUES: { label: string; cmAt100m: number }[] = [
  { label: '1/8 MOA', cmAt100m: 2.908882 / 8 },
  { label: '1/4 MOA', cmAt100m: 2.908882 / 4 },
  { label: '1/3 MOA', cmAt100m: 2.908882 / 3 },
  { label: '1/2 MOA', cmAt100m: 2.908882 / 2 },
  { label: '1 MOA', cmAt100m: 2.908882 },
  { label: '0,05 MIL', cmAt100m: 0.5 },
  { label: '0,1 MIL', cmAt100m: 1 },
  { label: '1 cm / 100 m', cmAt100m: 1 },
]

function cm(value: number): string {
  return value.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Vad betyder 1/4 MOA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ett klick motsvarar en fjärdedels minutvinkel, vilket flyttar träffpunkten ungefär 0,73 cm på 100 meter. På 50 meter blir det hälften och på 200 meter dubbelt.',
      },
    },
    {
      '@type': 'Question',
      name: 'Är MOA eller MIL bäst?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ingetdera är bättre. Det viktiga är att riktmedlet och rattarna använder samma enhet, så att du kan mäta i siktet och vrida samma värde på ratten.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hur vet jag vilket klickvärde mitt sikte har?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Det står nästan alltid tryckt på rattarna, till exempel "1 click = 1/4 MOA". Annars finns det i manualen eller på tillverkarens produktsida.',
      },
    },
  ],
}

export default function Page() {
  return (
    <ArticleLayout
      article={article}
      lead="Ett klick flyttar träffpunkten en vinkel, inte ett antal centimeter. Det är hela förklaringen till varför samma avvikelse kräver olika många klick på olika avstånd."
      extraJsonLd={faqJsonLd}
    >
      <p>
        På rattarna till ditt kikarsikte står det något i stil med{' '}
        <em>1 click = 1/4 MOA</em> eller <em>0.1 MIL</em>. Båda beskriver samma sak: hur mycket
        träffpunkten flyttar sig för varje klick. Skillnaden är bara vilken vinkelenhet
        tillverkaren räknar i.
      </p>

      <h2>Varför vinkel och inte centimeter</h2>

      <p>
        Siktet vrider inte kulan — det vrider siktlinjen. När du klickar lutar du riktmedlet en
        aning i förhållande till pipan, och den lutningen ger större och större utslag ju längre
        bort målet står.
      </p>

      <p>
        Tänk på en ficklampa: vrider du den några grader flyttas ljuscirkeln några centimeter på
        en vägg tätt intill, men flera meter på en vägg långt bort. Siktets klick fungerar
        likadant. Därför krävs det ungefär dubbelt så många klick för att rätta en avvikelse på
        50 meter som på 100 meter — avvikelsen är lika stor i centimeter, men motsvarar dubbelt
        så stor vinkel.
      </p>

      <h2>MOA — minut av en grad</h2>

      <p>
        MOA står för <em>minute of angle</em>, alltså en sextiondels grad. Det är ett gammalt mått
        som kommer från den engelskspråkiga världen, där det praktiska med det är att 1 MOA
        motsvarar ungefär en tum på 100 yards.
      </p>

      <p>
        I metriska mått blir 1 MOA <strong>2,91 cm på 100 meter</strong>. De allra flesta
        jaktsikten har rattar med 1/4 MOA per klick, vilket ger cirka 0,73 cm per klick på 100
        meter — lagom fint för jakt utan att bli petigt.
      </p>

      <Callout title="MOA och &quot;shooter's MOA&quot;">
        <p>
          En äkta MOA är 2,908 cm på 100 meter. Vissa tillverkare använder i stället ett avrundat
          mått där 1 MOA är exakt en tum på 100 yards, alltså 2,54 cm på 91,44 meter. Det kallas
          ibland SMOA eller IPHY.
        </p>
        <p>
          Skillnaden är knappt fem procent och märks inte på jaktavstånd — den syns först när du
          vrider många klick på långt håll. Står det bara &quot;MOA&quot; på rattarna kan du utgå
          från det äkta måttet.
        </p>
      </Callout>

      <h2>MIL — milliradian</h2>

      <p>
        MIL, eller mrad, står för milliradian och är en tusendels radian. Det låter mer
        komplicerat men är i praktiken enklare i metriska mått:{' '}
        <strong>1 MIL är exakt 10 cm på 100 meter</strong>. Ett vanligt klickvärde är 0,1 MIL,
        alltså precis 1 cm per klick på 100 meter.
      </p>

      <p>
        Den räta siffran gör huvudräkningen enkel. Sitter du 6 cm fel på 100 meter är det 6 klick
        med ett 0,1 MIL-sikte — ingen omräkning alls. På 200 meter blir samma avvikelse 3 klick,
        eftersom varje klick där flyttar 2 cm.
      </p>

      <h2>Sikten som anges i centimeter</h2>

      <p>
        En del europeiska jaktsikten hoppar över vinkelenheterna och skriver rakt ut{' '}
        <em>1 cm / 100 m</em> på ratten. Det är samma sak som 0,1 MIL. Förekommer också som 0,5
        cm eller 1,5 cm per klick på 100 meter.
      </p>

      <h2>Tabell: så många centimeter flyttar ett klick</h2>

      <p>
        Leta upp ditt klickvärde i vänsterkolumnen och ditt avstånd på översta raden. Siffran är
        hur många centimeter ett enda klick flyttar träffpunkten.
      </p>

      <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/60">
              <th className="p-3 text-left font-semibold">Klickvärde</th>
              {DISTANCES.map((distance) => (
                <th key={distance} className="p-3 text-right font-semibold tabular">
                  {distance} m
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLICK_VALUES.map((unit) => (
              <tr key={unit.label} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{unit.label}</td>
                {DISTANCES.map((distance) => (
                  <td key={distance} className="p-3 text-right text-muted-foreground tabular">
                    {cm((unit.cmAt100m * distance) / 100)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        Vill du slippa slå upp: <Link href="/">verktyget</Link> räknar ut antalet klick åt dig när
        du fyller i avvikelse, avstånd och klickvärde, och visar dessutom hur mycket som blir kvar
        efter avrundningen till hela klick.
      </p>

      <h2>Så räknar du själv</h2>

      <pre>
        <code>{`cm per klick = klickvärdet på 100 m × (avståndet / 100)
antal klick  = avvikelsen i cm / cm per klick`}</code>
      </pre>

      <p>
        <strong>Exempel.</strong> Du har ett sikte med 1/4 MOA och skjuter på 150 meter.
        Medelträffpunkten sitter 7 cm för högt.
      </p>

      <ul>
        <li>cm per klick = 0,73 × (150 / 100) = 1,09 cm</li>
        <li>antal klick = 7 / 1,09 ≈ 6,4</li>
        <li>Vrid 6 klick ner. Kvar blir ungefär en halv centimeter, långt under spridningen.</li>
      </ul>

      <h2>MOA eller MIL — vilket ska jag välja?</h2>

      <p>
        Ingetdera är bättre. Det som spelar roll är att <strong>riktmedel och rattar talar samma
        språk</strong>. Har du ett riktmedel med mil-streck och rattar i MOA måste du räkna om
        varje gång du mäter något i siktet, och det blir fel förr eller senare.
      </p>

      <p>
        Skjuter du mest jakt på normala avstånd spelar valet mindre roll — då justerar du siktet
        en gång och siktar sedan med mitten. Håller du på med långhåll där du mäter i riktmedlet
        och vrider på ratten under skjutningen är en genomgående enhet mycket värd, och
        milliradian är då enklare att räkna med i metriska mått.
      </p>

      <h2>Hitta ditt siktes klickvärde</h2>

      <ol>
        <li>
          <strong>Titta på rattarna.</strong> Nästan alla har det tryckt under locket eller på
          sidan.
        </li>
        <li>
          <strong>Slå upp i manualen</strong> eller på tillverkarens produktsida.
        </li>
        <li>
          <strong>Mät det själv.</strong> Skjut ett skott, vrid ett känt antal klick i en
          riktning — förslagsvis 20 stycken — och skjut igen mot samma riktpunkt. Mät avståndet
          mellan hålen och dela med antalet klick. Då har du cm per klick på det avståndet.
        </li>
      </ol>

      <p>
        Den sista metoden är också ett bra sätt att kontrollera att siktet faktiskt spårar som
        det ska. Flyttar sig träffpunkten bara halva den förväntade sträckan är det något fel,
        antingen på siktet eller på montaget.
      </p>

      <Callout title="Har du ett eget klickvärde?">
        <p>
          Verktyget har de vanliga värdena förvalda, men också ett fält för att skriva in ett eget
          i centimeter per klick på 100 meter. Det sparas på vapenprofilen så du slipper fylla i
          det varje gång.
        </p>
      </Callout>

      <h2>Vanliga frågor</h2>

      <h3>Hur många centimeter är 1 MOA?</h3>
      <p>
        2,91 cm på 100 meter. På 50 meter är det 1,45 cm och på 200 meter 5,82 cm.
      </p>

      <h3>Hur många MOA är 1 MIL?</h3>
      <p>
        Ungefär 3,44 MOA. Ett klick på 0,1 MIL motsvarar alltså lite mer än ett klick på 1/3 MOA.
      </p>

      <h3>Varför står det både MOA och MIL på mitt sikte?</h3>
      <p>
        Då har du troligen ett riktmedel i en enhet och rattar i en annan, vilket är en vanlig och
        olycklig kombination på äldre sikten. Kontrollera manualen och håll isär vilken enhet du
        mäter respektive vrider i.
      </p>

      <h3>Spelar avrundningen till hela klick någon roll?</h3>
      <p>
        Sällan. Med 1/4 MOA blir felet som mest cirka 0,4 cm på 100 meter, vilket är mindre än
        spridningen hos de flesta vapen och skyttar. Verktyget visar hur mycket som blir kvar så
        du själv kan se att det är försumbart.
      </p>
    </ArticleLayout>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleLayout, Callout } from '@/components/article-layout'
import { getArticle } from '@/lib/articles'

const article = getArticle('kontrollera-infor-jakten')!

export const metadata: Metadata = {
  title: article.metaTitle ?? article.title,
  description: article.description,
}

const causes = [
  {
    cause: 'Stötar och fall',
    detail:
      'Ett vapen som ramlat ur stället, åkt i bilen utan fodral eller fått en smäll mot siktet kan ha flyttat sig flera centimeter utan att det syns.',
  },
  {
    cause: 'Skruvar som lossnat',
    detail:
      'Vibrationer från skjutning och transport gör att ring- och basskruvar kan släppa. Träffpunkten vandrar då lite för varje serie.',
  },
  {
    cause: 'Byte av ammunition',
    detail:
      'Ny kulvikt, ny kultyp eller till och med en ny tillverkningssats kan flytta träffpunkten. Är du inskjuten med en sort är du inte inskjuten med en annan.',
  },
  {
    cause: 'Temperatur',
    detail:
      'Krutet arbetar olika i värme och kyla. Skjuter du in i plusgrader i augusti och jagar i sträng kyla i december kan träffpunkten skilja sig.',
  },
  {
    cause: 'Fukt i stocken',
    detail:
      'Trässtockar rör sig med luftfuktigheten. Har vapnet stått i en fuktig förvaring under sommaren kan spänningarna mot pipan ha ändrats.',
  },
  {
    cause: 'Ommontering',
    detail:
      'Har siktet varit av, eller har du bytt ringar eller bas, ska vapnet betraktas som oinskjutet tills du bevisat motsatsen.',
  },
]

export default function Page() {
  return (
    <ArticleLayout
      article={article}
      lead="Ett vapen som var inskjutet i fjol är inte automatiskt inskjutet i år. Här är vad som får träffpunkten att vandra, och hur du kontrollerar det med några få skott."
    >
      <p>
        Kontrollskjutningen tar tjugo minuter och tre skott. Den är ändå det steg som oftast
        hoppas över, för att vapnet &quot;var ju inskjutet&quot;. Problemet är att ingenting av
        det som flyttar träffpunkten syns på vapnet.
      </p>

      <h2>Vad som får ett inskjutet vapen att hamna fel</h2>

      <div className="not-prose my-6 divide-y divide-border overflow-hidden rounded-xl border border-border">
        {causes.map((item) => (
          <div key={item.cause} className="p-4">
            <p className="text-sm font-semibold">{item.cause}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </div>

      <h2>När du bör kontrollera</h2>

      <ul>
        <li>Inför varje säsong, i god tid så du hinner åtgärda något.</li>
        <li>Efter att vapnet ramlat eller fått en ordentlig smäll.</li>
        <li>Efter längre transport, särskilt flyg.</li>
        <li>När du byter ammunition — även mellan satser av samma sort.</li>
        <li>Efter ommontering eller service.</li>
        <li>Om något känns fel. Ett oförklarligt bomskott är skäl nog.</li>
      </ul>

      <p>
        Många jaktlag kräver dessutom ett godkänt skjutprov, och för viss jakt finns krav i
        regelverket. Kontrollera vad som gäller för just din jakt och ditt lag — kraven skiljer
        sig åt.
      </p>

      <h2>Så gör du kontrollen</h2>

      <ol>
        <li>
          <strong>Kontrollera montaget först.</strong> Ta tag i siktet och försök vrida det.
          Känns det minsta glapp är det där felet sitter, och då är det ingen idé att skjuta
          förrän det är åtgärdat.
        </li>
        <li>
          <strong>Skjut det första skottet från kall pipa.</strong> Det är det skottet som
          räknas på jakten. Notera var det tog innan du skjuter fler.
        </li>
        <li>
          <strong>Fyll på till tre skott</strong> mot samma riktpunkt och titta på gruppens
          medelträffpunkt.
        </li>
        <li>
          <strong>Jämför med förra gången.</strong> Sitter medelträffpunkten på samma ställe som
          vid inskjutningen är du klar.
        </li>
        <li>
          <strong>Justera bara om avvikelsen är större än spridningen.</strong> Är gruppen 4 cm
          stor och sitter 2 cm fel har du inget att gå på — skjut en grupp till innan du rör
          rattarna.
        </li>
      </ol>

      <Callout title="Skottet som räknas är det kalla">
        <p>
          På banan skjuter man ofta serie efter serie med varm pipa. På jakten har du ett skott
          från en pipa som stått kall i timmar. På många vapen sitter det första skottet en bit
          ifrån de efterföljande.
        </p>
        <p>
          Därför är det värt att notera det kalla skottet separat vid varje kontroll. Ser du
          samma avvikelse gång på gång vet du hur ditt vapen beter sig när det gäller.
        </p>
      </Callout>

      <h2>Anteckna, så slipper du gissa nästa år</h2>

      <p>
        Den som skrivit ner var träffpunkten satt förra året behöver inte fundera på om siktet
        vandrat — det syns direkt. Anteckna avstånd, ammunition, medelträffpunkt och gruppstorlek.
      </p>

      <p>
        <Link href="/">Verktyget</Link> har en logg som sparar det per vapen, direkt i mobilen.
        Våra <Link href="/maltavlor">måltavlor</Link> har också rader att fylla i för vapen,
        ammunition, avstånd och datum — spara tavlan så har du ett fysiskt kvitto på hur det såg
        ut.
      </p>

      <h2>Checklista inför säsongen</h2>

      <ul>
        <li>Skruvar i bas och ringar kontrollerade</li>
        <li>Siktet sitter fast och i våg</li>
        <li>Diopter inställd mot ditt öga</li>
        <li>Samma ammunition som du ska jaga med</li>
        <li>Kallt första skott noterat</li>
        <li>Kontrollgrupp om tre skott skjuten</li>
        <li>Medelträffpunkt jämförd med förra passet</li>
        <li>Resultatet antecknat</li>
      </ul>

      <h2>Vanliga frågor</h2>

      <h3>Hur många skott behövs för en kontroll?</h3>
      <p>
        Tre räcker om allt stämmer. Sitter de rätt är du klar. Behöver du justera går det åt tre
        till för att bekräfta.
      </p>

      <h3>Måste jag skjuta om helt om jag byter ammunition?</h3>
      <p>
        Inte nödvändigtvis om det handlar om samma kulvikt och typ, men du måste kontrollera.
        Skillnaden kan vara någon centimeter — eller betydligt mer.
      </p>

      <h3>Räcker det att kontrollera på 50 meter?</h3>
      <p>
        Det ger dig ett snabbt besked om något är grovt fel, men inte om nollan på längre håll
        stämmer. Läs mer i{' '}
        <Link href="/artiklar/skjuta-in-pa-50-meter">artikeln om inskjutning på 50 meter</Link>.
      </p>

      <h3>Vad gör jag om gruppen plötsligt blivit mycket större?</h3>
      <p>
        Då är det inte siktets inställning som är problemet. Börja med montaget, gå sedan vidare
        till stödet, ammunitionen och tekniken.{' '}
        <Link href="/artiklar/lasa-traffbilden">Artikeln om träffbilden</Link> går igenom vad
        olika mönster brukar bero på.
      </p>
    </ArticleLayout>
  )
}

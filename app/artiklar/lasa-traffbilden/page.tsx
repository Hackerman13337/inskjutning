import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleLayout, Callout } from '@/components/article-layout'
import { getArticle } from '@/lib/articles'

const article = getArticle('lasa-traffbilden')!

export const metadata: Metadata = {
  title: article.metaTitle ?? article.title,
  description: article.description,
}

const patterns = [
  {
    shape: 'Liten grupp som sitter fel',
    meaning:
      'Vapnet och du gör rätt — bara siktet pekar åt fel håll. Det här är det enkla fallet: räkna ut klicken och vrid.',
  },
  {
    shape: 'Stor grupp som sitter centrerad',
    meaning:
      'Siktet är rätt inställt men något annat sprider. Att vrida på rattarna hjälper inte. Leta i stödet, ammunitionen eller tekniken.',
  },
  {
    shape: 'Spridning mest i höjdled',
    meaning:
      'Ofta andning, puls eller varierande anläggning. Kan också vara ojämn utgångshastighet i ammunitionen, eller att stödet tar mot pipan.',
  },
  {
    shape: 'Spridning mest i sidled',
    meaning:
      'Vind är den vanligaste orsaken utomhus. Annars sidotryck mot stocken, eller att du drar i avtryckaren i stället för att klämma rakt bakåt.',
  },
  {
    shape: 'Gruppen vandrar under serien',
    meaning:
      'Klassiskt tecken på varm pipa eller ett montage som glappar. Låt pipan svalna och kontrollera skruvarna.',
  },
  {
    shape: 'En ensam flygare långt utanför',
    meaning:
      'Nästan alltid ett dåligt skott snarare än ett dåligt vapen. Notera det, skjut om serien och se om det upprepas.',
  },
]

export default function Page() {
  return (
    <ArticleLayout
      article={article}
      lead="Ett enskilt skott säger nästan ingenting. Först när du ser en hel grupp går det att skilja på ett sikte som pekar fel och ett vapen som skjuter spritt — och de två felen har helt olika lösningar."
    >
      <p>
        Det är frestande att skjuta ett skott, se att det sitter snett och genast börja vrida på
        rattarna. Problemet är att du då kan råka justera bort en slump. Nästa skott hamnar
        någon annanstans, du vrider igen, och efter en ask ammunition är siktet sämre inställt än
        när du började.
      </p>

      <p>
        Lösningen är att alltid titta på en grupp, och att skilja på två saker som är lätta att
        blanda ihop: <strong>var gruppen sitter</strong> och{' '}
        <strong>hur stor den är</strong>.
      </p>

      <h2>Medelträffpunkten — var gruppen sitter</h2>

      <p>
        Medelträffpunkten, ofta förkortad MPI efter engelskans <em>mean point of impact</em>, är
        gruppens tyngdpunkt. Du får den genom att ta medelvärdet av alla hålens lägen, både i
        sidled och i höjdled.
      </p>

      <p>
        Har du tre skott som sitter 2, 4 och 3 cm till höger är medelträffpunkten 3 cm till
        höger. Det är den siffran du ska mata in när du räknar ut justeringen — inte det skott
        som satt värst, och inte det som satt bäst.
      </p>

      <p>
        Att justera mot medelträffpunkten i stället för mot ett enskilt hål är den enskilt
        största skillnaden mellan att bli klar på tio skott och att hålla på hela förmiddagen.{' '}
        <Link href="/">Verktyget</Link> räknar ut den åt dig när du lägger in flera skott på
        tavlan.
      </p>

      <h2>Spridningen — hur stor gruppen är</h2>

      <p>
        Gruppstorleken mäts vanligen som avståndet mellan de två hål som sitter längst ifrån
        varandra. Den säger ingenting om siktets inställning, men allt om hur mycket du kan lita
        på den.
      </p>

      <p>
        Sitter gruppen 4 cm fel men är 6 cm stor är avvikelsen mindre än spridningen. Då vet du
        egentligen inte om siktet pekar fel — skillnaden kan lika gärna vara slump. Skjut en
        grupp till innan du vrider.
      </p>

      <Callout title="Därför anges spridning ofta i MOA">
        <p>
          En grupp på 3 cm är bra på 100 meter men dålig på 25 meter. Genom att räkna om till MOA
          får du ett mått som går att jämföra mellan avstånd: 3 cm på 100 meter är drygt 1 MOA,
          och samma 3 cm på 50 meter är drygt 2 MOA.
        </p>
        <p>
          Verktyget visar gruppstorleken i både centimeter och MOA. Mer om enheterna i{' '}
          <Link href="/artiklar/moa-och-mil">artikeln om MOA och MIL</Link>.
        </p>
      </Callout>

      <h2>Vad olika träffbilder betyder</h2>

      <div className="not-prose my-6 divide-y divide-border overflow-hidden rounded-xl border border-border">
        {patterns.map((pattern) => (
          <div key={pattern.shape} className="p-4">
            <p className="text-sm font-semibold">{pattern.shape}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {pattern.meaning}
            </p>
          </div>
        ))}
      </div>

      <p>
        Det viktigaste mönstret att känna igen är skillnaden mellan de två första. En liten grupp
        på fel ställe är ett <em>siktproblem</em> och löses på trettio sekunder. En stor grupp i
        mitten är ett <em>spridningsproblem</em> och löses inte alls med rattarna, hur mycket du
        än vrider.
      </p>

      <h2>Hur många skott ska en grupp bestå av?</h2>

      <p>
        Tre skott är standard vid inskjutning och räcker gott för att hitta medelträffpunkten.
        Det är också snällt mot både pipan och plånboken.
      </p>

      <p>
        Fler skott ger en mer rättvis bild av spridningen. Tre skott hamnar ibland tätt av ren
        tur, och en treskottsgrupp ser därför i genomsnitt mindre ut än vapnet egentligen är.
        Vill du veta hur bra vapnet faktiskt skjuter är fem skott ett bättre mått — men låt då
        pipan svalna emellan.
      </p>

      <h2>Vad är en bra grupp?</h2>

      <p>
        För ett jaktvapen på 100 meter är en grupp runt 3 cm, alltså ungefär 1 MOA, mer än
        tillräckligt för allt normalt jaktskytte. Många jaktvapen ligger snarare kring 1,5 MOA
        med fabriksammunition, och även det räcker långt.
      </p>

      <p>
        Jämför gärna mot dig själv över tid i stället för mot andras siffror. Det är när din
        egen träffbild plötsligt blir dubbelt så stor som du har anledning att leta fel. Sparar
        du passen i verktygets logg ser du utvecklingen direkt.
      </p>

      <h2>Mät rätt från början</h2>

      <p>
        Allt det här bygger på att måtten på tavlan stämmer. Två saker att hålla koll på:
      </p>

      <ul>
        <li>
          <strong>Mät från riktpunkten</strong>, inte från det första hålet eller från tavlans
          kant.
        </li>
        <li>
          <strong>Kontrollera utskriften.</strong> En måltavla som skrivits ut med &quot;anpassa
          till sidan&quot; har rutor som inte är en centimeter, och då blir varje siffra fel.
          Våra <Link href="/maltavlor">måltavlor</Link> har ett kontrollmått i nederkanten att
          mäta med linjal.
        </li>
      </ul>

      <h2>Vanliga frågor</h2>

      <h3>Ska jag räkna med flygaren?</h3>
      <p>
        Vet du säkert att du ryckte till i just det skottet får du gärna bortse från det — men
        var ärlig mot dig själv. Slänger du varje skott som inte passar får du en träffbild som
        ser bättre ut än verkligheten, och det hjälper ingen ute i skogen.
      </p>

      <h3>Varför sitter gruppen olika högt olika dagar?</h3>
      <p>
        Temperatur påverkar både ammunitionen och materialet i vapnet, och kall pipa mot varm
        pipa ger skillnad på många vapen. Det är ett av skälen att{' '}
        <Link href="/artiklar/kontrollera-infor-jakten">kontrollera inskjutningen</Link> under
        förhållanden som liknar dem du ska jaga i.
      </p>

      <h3>Hur mäter jag medelträffpunkten för hand?</h3>
      <p>
        Mät varje håls avstånd från riktpunkten i sidled och höjdled, med tecken — höger och upp
        som plus, vänster och ner som minus. Ta sedan medelvärdet av sidmåtten och medelvärdet av
        höjdmåtten var för sig. Eller låt verktyget göra det.
      </p>
    </ArticleLayout>
  )
}

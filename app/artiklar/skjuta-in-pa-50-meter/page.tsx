import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleLayout, Callout } from '@/components/article-layout'
import { getArticle } from '@/lib/articles'

const article = getArticle('skjuta-in-pa-50-meter')!

export const metadata: Metadata = {
  title: article.metaTitle ?? article.title,
  description: article.description,
}

export default function Page() {
  return (
    <ArticleLayout
      article={article}
      lead="Har du bara en 50-metersbana men skjuter längre i skogen? Det går utmärkt att skjuta in på kort håll — men inte genom att bara halvera avvikelsen. Här är vad som faktiskt händer med kulan."
    >
      <p>
        Många har närmare till en kort bana än till en 100-metersbana, och undrar om det duger.
        Svaret är ja, med två förbehåll: antalet klick blir ett annat än du tror, och träffpunkten
        på 50 meter är inte densamma som på 100.
      </p>

      <h2>Kulan skär siktlinjen två gånger</h2>

      <p>
        Kikarsiktet sitter fyra till fem centimeter ovanför pipan. För att kulan alls ska kunna
        träffa där riktmedlet pekar måste pipan luta en aning uppåt i förhållande till siktlinjen.
        Kulan lämnar därför loppet <em>under</em> siktlinjen, stiger upp genom den, går en bit
        ovanför, och faller sedan ner genom den igen.
      </p>

      <p>Det betyder att kulbanan korsar siktlinjen på två ställen:</p>

      <ul>
        <li>
          <strong>Den nära nollan</strong>, ofta någonstans runt 25–35 meter beroende på
          ammunition och hur högt siktet sitter.
        </li>
        <li>
          <strong>Den bortre nollan</strong>, som är den du brukar mena när du säger att vapnet är
          inskjutet på 100 meter.
        </li>
      </ul>

      <p>
        Mellan de två punkterna ligger kulan <em>ovanför</em> siktlinjen. Ett vapen som är
        inskjutet på 100 meter träffar alltså en aning högt på 50 meter — typiskt någon eller ett
        par centimeter.
      </p>

      <Callout title="Därför fungerar en 50-metersnolla längre än man tror">
        <p>
          Skjuter du in så att kulan träffar mitt i prick på 50 meter fortsätter den att stiga en
          bit, och kommer ner genom siktlinjen igen först en bra bit längre bort — för många
          vanliga jaktkalibrer någonstans kring 150 till 200 meter.
        </p>
        <p>
          Det är själva poängen med den korta nollan: du får ett ganska långt spann där kulan
          aldrig avviker särskilt mycket från riktpunkten. Exakt var den bortre nollan hamnar
          beror helt på din ammunition, så se siffrorna som en storleksordning och inte som en
          sanning för just ditt vapen.
        </p>
      </Callout>

      <h2>Alternativ 1: skjut in mitt i prick på 50 meter</h2>

      <p>
        Enklast, och fullt användbart för jakt på normala skogsavstånd. Du siktar mitt och
        justerar tills gruppen sitter mitt. Resultatet blir att du träffar någon centimeter högt
        på mellanavstånden, vilket sällan spelar någon roll i praktiken.
      </p>

      <p>
        Det här är ett bra val om du jagar i tät skog där skotten sällan blir längre än ett
        hundratal meter.
      </p>

      <h2>Alternativ 2: sikta på en nolla längre bort</h2>

      <p>
        Vill du ha nollan på just 100 meter men bara har 50 meter att tillgå, ska du inte träffa
        mitt i prick på 50 — du ska träffa en liten bit <strong>högt</strong>, eftersom kulan
        fortfarande är på väg uppåt genom siktlinjen där.
      </p>

      <p>
        För en vanlig jaktkaliber med siktet fyra till fem centimeter över pipan handlar det om
        ungefär en till två centimeter högt på 50 meter. Men det beror på utgångshastighet,
        kulvikt och sikteshöjd, så betrakta det som en utgångspunkt — inte ett facit.
      </p>

      <p>
        I <Link href="/">verktyget</Link> finns fältet{' '}
        <strong>Önskad träffpunkt</strong> för precis det här. Lägg in hur högt du vill att
        träffen ska sitta, så räknar verktyget klicken mot den punkten i stället för mot mitten.
      </p>

      <h2>Kom ihåg: dubbelt så många klick</h2>

      <p>
        Det här är det fel som kostar flest skott. Ett klick flyttar träffpunkten en{' '}
        <em>vinkel</em>, så på halva avståndet flyttar det hälften så många centimeter. För att
        rätta en avvikelse på 50 meter behöver du därför ungefär dubbelt så många klick som du
        hade behövt för samma avvikelse på 100 meter.
      </p>

      <p>
        Med ett sikte på 1/4 MOA flyttar ett klick cirka 0,73 cm på 100 meter men bara 0,36 cm på
        50 meter. Sitter du 4 cm fel på 50 meter blir det alltså cirka 11 klick, inte 5.
      </p>

      <p>
        Fyll bara i rätt avstånd i verktyget så är det medräknat. Mer om räknandet i{' '}
        <Link href="/artiklar/moa-och-mil">artikeln om MOA och MIL</Link>.
      </p>

      <h2>Var noggrannare på kort håll</h2>

      <p>
        En sak till som är lätt att missa: på 50 meter motsvarar varje centimeter dubbelt så stor
        vinkel som på 100 meter. Ett mätfel på en halv centimeter vid tavlan blir alltså dubbelt
        så illa när det räknas om.
      </p>

      <ul>
        <li>
          Använd en tavla med rutnät och räkna rutor i stället för att uppskatta.{' '}
          <Link href="/maltavlor">Våra måltavlor</Link> har centimeterrutor och ett kontrollmått
          för utskriften.
        </li>
        <li>Mät alltid från riktpunkten, inte från närmaste hål.</li>
        <li>Skjut tre skott och använd gruppens medelträffpunkt.</li>
      </ul>

      <h2>Kontrollera på riktigt avstånd när du kan</h2>

      <p>
        Inskjutning på 50 meter är ett bra sätt att komma rätt, men det ersätter inte en
        kontroll på det avstånd du faktiskt tänker skjuta på. Får du chansen att skjuta ett par
        skott på 100 meter, gör det — det är då du ser om antagandet om kulbanan stämde för just
        din ammunition.
      </p>

      <h2>Vanliga frågor</h2>

      <h3>Kan jag skjuta in på 25 meter i stället?</h3>
      <p>
        25 meter fungerar bra för att komma in på pappret, men är för kort för en färdig
        inskjutning. Där är kulan fortfarande på väg upp genom siktlinjen och små mätfel får stort
        genomslag. Se det som grovriktning — se{' '}
        <Link href="/artiklar/skjuta-in-kikarsikte">guiden om att skjuta in</Link>.
      </p>

      <h3>Hur högt ska jag träffa på 50 meter för nolla på 100?</h3>
      <p>
        För en vanlig jaktkaliber brukar det landa på en till två centimeter högt, men det beror
        på ammunition och sikteshöjd. Har du en kulbanetabell för din laddning: leta upp vad den
        anger för 50 meter vid 100-metersnolla och använd den siffran.
      </p>

      <h3>Gäller samma sak för .22?</h3>
      <p>
        Principen är densamma, men eftersom en .22 LR har betydligt lägre hastighet och kraftigare
        kulbana blir avstånden helt andra. En finkalibrig bössa skjuts oftast in på just det
        avstånd den ska användas på.
      </p>
    </ArticleLayout>
  )
}

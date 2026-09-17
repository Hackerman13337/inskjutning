import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleLayout, Callout } from '@/components/article-layout'
import { getArticle } from '@/lib/articles'

const article = getArticle('zeiss-sikte')!

export const metadata: Metadata = {
  title: article.metaTitle ?? article.title,
  description: article.description,
}

export default function Page() {
  return (
    <ArticleLayout
      article={article}
      lead="Zeiss jaktsikten anges ofta i centimeter per 100 meter i stället för MOA, och många har en ballistisk höjdratt. Båda sakerna påverkar hur du skjuter in — här är vad du behöver veta."
    >
      <p>
        Själva inskjutningen går till likadant oavsett märke: skjut en grupp, mät avvikelsen från
        gruppens medelträffpunkt och vrid rätt antal klick. Det som skiljer mellan fabrikat är
        <strong> hur mycket ett klick flyttar träffpunkten</strong> och hur rattarna är byggda.
      </p>

      <h2>Hitta klickvärdet</h2>

      <p>
        Zeiss tillverkar sikten för både den europeiska jaktmarknaden och för långhållsskytte, och
        de använder olika enheter. Kontrollera alltid på ditt eget sikte:
      </p>

      <ul>
        <li>
          <strong>Titta på ratten.</strong> Värdet står tryckt på ratten eller under skyddslocket,
          exempelvis som <em>1 click = 1 cm / 100 m</em>.
        </li>
        <li>
          <strong>Kolla manualen</strong> eller Zeiss produktsida för just din modell och
          förstoring — klickvärdet kan skilja sig mellan varianter av samma serie.
        </li>
        <li>
          <strong>Mät det själv</strong> om märkningen är sliten: skjut ett skott, vrid 20 klick
          i en riktning, skjut igen mot samma riktpunkt och dela avståndet mellan hålen med 20.
        </li>
      </ul>

      <p>
        Många europeiska jaktsikten är märkta i <em>cm/100 m</em>, vilket gör räknandet enkelt: ett
        klick på 1 cm/100 m flyttar exakt 1 cm på 100 meter, 0,5 cm på 50 meter och 2 cm på 200
        meter. Det motsvarar samma sak som 0,1 MIL. Modeller avsedda för längre håll anges i
        stället ofta i MOA eller MRAD — läs{' '}
        <Link href="/artiklar/moa-och-mil">genomgången av MOA och MIL</Link> om du är osäker på
        skillnaden.
      </p>

      <Callout title="Spara klickvärdet på en vapenprofil">
        <p>
          I <Link href="/">verktyget</Link> kan du lägga upp en profil per vapen med klickvärde,
          inskjutningsavstånd och önskad träffpunkt. Då slipper du leta upp siffran varje gång du
          är på banan, och du får en logg över hur siktet betett sig mellan passen.
        </p>
      </Callout>

      <h2>Den ballistiska ratten</h2>

      <p>
        Zeiss ballistiska höjdratt, ASV, låter dig vrida till ett förvalt avstånd i stället för
        att hålla över målet. Den bygger på att vapnet först är inskjutet på ett grundavstånd,
        oftast 100 meter, och att ratten sedan nollställs i det läget.
      </p>

      <p>Två saker är värda att känna till vid inskjutning:</p>

      <ul>
        <li>
          <strong>Ratten ska stå på grundavståndet.</strong> Står den kvar på en inställning för
          längre håll träffar du högt, och det är lätt att tolka som att siktet tappat nollan. Det
          är en av de vanligaste orsakerna till en oförklarligt hög träffbild.
        </li>
        <li>
          <strong>Skjut in först, ställ in ballistiken sedan.</strong> Den ballistiska skalan
          bygger på en kulbana som utgår från en korrekt grundnolla. Är grundnollan fel blir alla
          avstånd fel.
        </li>
      </ul>

      <h2>Nollställa ratten efter inskjutningen</h2>

      <p>
        När vapnet träffar där du vill vill du att ratten ska visa noll i det läget, så att du
        alltid kan hitta tillbaka. Principen är densamma på de flesta sikten:
      </p>

      <ol>
        <li>Skjut in klart och kontrollera med en grupp.</li>
        <li>
          Lossa skruven eller skruvarna i rattens ovansida — oftast en insexskruv, ibland flera
          små.
        </li>
        <li>
          Vrid rattens sifferskala till noll <strong>utan att själva mekanismen följer med</strong>.
        </li>
        <li>Dra åt igen och kontrollera att träffpunkten inte ändrats.</li>
      </ol>

      <p>
        Hur just din modell nollställs står i manualen, och det skiljer sig mellan serier och
        årsmodeller. Är du osäker: skjut ett kontrollskott efteråt så vet du.
      </p>

      <h2>Steg för steg</h2>

      <ol>
        <li>Kontrollera att montaget sitter fast och att siktet inte glappar i ringarna.</li>
        <li>Ställ in dioptern mot ditt öga innan du skjuter.</li>
        <li>Se till att den ballistiska ratten står på grundavståndet.</li>
        <li>Grovrikta på kort håll om siktet är nymonterat.</li>
        <li>Skjut tre skott på ditt inskjutningsavstånd.</li>
        <li>
          Mata in avvikelsen i <Link href="/">verktyget</Link> tillsammans med avstånd och
          klickvärde.
        </li>
        <li>Vrid det antal klick som visas och bekräfta med en kontrollgrupp.</li>
        <li>Nollställ rattarna.</li>
      </ol>

      <p>
        Hela gången med förberedelser, vanliga fel och kontroll finns i{' '}
        <Link href="/artiklar/skjuta-in-kikarsikte">guiden om att skjuta in kikarsiktet</Link>.
        Träffar du inte tavlan alls, börja i stället med{' '}
        <Link href="/artiklar/utanfor-tavlan">artikeln om att hitta tillbaka till tavlan</Link>.
      </p>

      <h2>Vanliga frågor</h2>

      <h3>Vilket klickvärde har mitt Zeiss-sikte?</h3>
      <p>
        Det beror på modell och variant, så läs av ratten eller manualen. Jaktmodeller för
        europeisk marknad anges ofta i cm/100 m, långhållsmodeller i MOA eller MRAD.
      </p>

      <h3>Varför träffar jag högt trots att jag nyss skjöt in?</h3>
      <p>
        Kontrollera att den ballistiska ratten står på grundavståndet. Det är den vanligaste
        förklaringen, och den syns inte förrän man tittar efter.
      </p>

      <h3>Ska jag skjuta in på 100 meter?</h3>
      <p>
        Om siktet har en ballistisk ratt: ja, eller på det grundavstånd som skalan utgår ifrån.
        Annars fungerar det avstånd som passar din jakt.
      </p>
    </ArticleLayout>
  )
}

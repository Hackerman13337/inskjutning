import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleLayout, Callout } from '@/components/article-layout'
import { getArticle } from '@/lib/articles'

const article = getArticle('swarovski-sikte')!

export const metadata: Metadata = {
  title: article.metaTitle ?? article.title,
  description: article.description,
}

export default function Page() {
  return (
    <ArticleLayout
      article={article}
      lead="Swarovskis jaktsikten anges ofta i centimeter per 100 meter, och många har en ballistisk höjdratt som förutsätter en korrekt grundnolla. Så gör du inskjutningen rätt från början."
    >
      <p>
        Ett dyrt sikte skjuter inte in sig självt. Gången är densamma som för alla andra sikten —
        skjut en grupp, mät från gruppens medelträffpunkt, vrid rätt antal klick — men två saker
        är värda att kontrollera innan du börjar: klickvärdet och vad den ballistiska ratten står
        på.
      </p>

      <h2>Hitta klickvärdet</h2>

      <ul>
        <li>
          <strong>Läs av ratten.</strong> Värdet står tryckt på ratten eller under locket, ofta som{' '}
          <em>1 cm / 100 m</em>.
        </li>
        <li>
          <strong>Slå upp modellen.</strong> Klickvärdet kan skilja mellan serier och mellan
          förstoringsvarianter av samma serie.
        </li>
        <li>
          <strong>Mät efter</strong> om märkningen är oläslig: skjut, vrid 20 klick, skjut igen mot
          samma riktpunkt, mät mellan hålen och dela med 20.
        </li>
      </ul>

      <p>
        Ett sikte märkt 1 cm/100 m är bekvämt att räkna med: sitter du 6 cm fel på 100 meter är
        det 6 klick. På 50 meter blir det 12 klick, eftersom varje klick där bara flyttar en halv
        centimeter. Varför det blir så förklaras i{' '}
        <Link href="/artiklar/moa-och-mil">artikeln om MOA och MIL</Link>.
      </p>

      <Callout title="Räkna inte i huvudet på banan">
        <p>
          Det är på 50 och 150 meter som huvudräkningen brukar gå snett, särskilt när man står
          kall. Mata in avstånd, klickvärde och avvikelse i <Link href="/">verktyget</Link> så får
          du antalet klick och åt vilket håll i klartext.
        </p>
      </Callout>

      <h2>Ballistisk ratt och personliga skalor</h2>

      <p>
        Swarovski erbjuder ballistiska höjdrattar där du vrider till ett avstånd i stället för att
        hålla över, och i vissa system en skala anpassad efter din egen ammunition.
      </p>

      <p>
        Gemensamt för alla sådana lösningar är att de <strong>bygger på grundnollan</strong>.
        Skalan räknar kulbanan från den punkt där vapnet är inskjutet, så:
      </p>

      <ul>
        <li>Skjut in ordentligt på grundavståndet först.</li>
        <li>Nollställ ratten i det läget.</li>
        <li>
          Kontrollera att ratten står på noll varje gång du börjar skjuta. En ratt som står kvar
          på 200 meter ger en träffbild som ser ut som om siktet tappat nollan.
        </li>
      </ul>

      <h2>Nollställa ratten</h2>

      <ol>
        <li>Skjut in klart och bekräfta med en kontrollgrupp.</li>
        <li>Lossa skruven eller skruvarna på rattens ovansida enligt manualen.</li>
        <li>Vrid skalan till noll utan att mekanismen följer med.</li>
        <li>Dra åt och kontrollera med ett skott att träffpunkten står kvar.</li>
      </ol>

      <p>
        Exakt hur det går till skiljer sig mellan modeller — ta manualen till hjälp första gången.
      </p>

      <h2>Steg för steg</h2>

      <ol>
        <li>Kontrollera montaget. Siktet ska inte gå att vrida i ringarna.</li>
        <li>Ställ in dioptern mot ditt öga.</li>
        <li>Kontrollera att den ballistiska ratten står på grundläget.</li>
        <li>Grovrikta på kort håll om siktet är nymonterat.</li>
        <li>Skjut tre skott och använd gruppens medelträffpunkt.</li>
        <li>Räkna ut klicken och vrid.</li>
        <li>Bekräfta med en ny grupp och nollställ rattarna.</li>
      </ol>

      <p>
        Hela gången finns i{' '}
        <Link href="/artiklar/skjuta-in-kikarsikte">guiden om att skjuta in kikarsiktet</Link>. Vad
        träffbilden säger om vapen och ammunition står i{' '}
        <Link href="/artiklar/lasa-traffbilden">artikeln om att läsa träffbilden</Link>.
      </p>

      <h2>Vanliga frågor</h2>

      <h3>Vilket klickvärde har mitt Swarovski-sikte?</h3>
      <p>
        Det står på ratten eller i manualen och skiljer mellan modeller. Europeiska jaktmodeller
        anges ofta i cm/100 m.
      </p>

      <h3>Måste jag skjuta in om siktet om jag byter ballistisk ratt?</h3>
      <p>
        Grundnollan gäller fortfarande, men kontrollera alltid med några skott efter att du
        skruvat på siktet. Och nollställ den nya ratten i det inskjutna läget.
      </p>

      <h3>Varför sitter gruppen rätt men enskilda skott långt utanför?</h3>
      <p>
        Då är det spridning snarare än siktets inställning. Börja med stödet och ammunitionen —{' '}
        <Link href="/artiklar/lasa-traffbilden">träffbildsartikeln</Link> går igenom vad olika
        mönster brukar bero på.
      </p>
    </ArticleLayout>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleLayout, Callout } from '@/components/article-layout'
import { getArticle } from '@/lib/articles'

const article = getArticle('leupold-sikte')!

export const metadata: Metadata = {
  title: article.metaTitle ?? article.title,
  description: article.description,
}

export default function Page() {
  return (
    <ArticleLayout
      article={article}
      lead="Leupold är amerikanskt och räknar därför oftast i MOA, inte i centimeter. Det gör att omräkningen till centimeter blir ett extra steg — här är hur du gör den rätt."
    >
      <p>
        Det första du behöver veta om ditt Leupold-sikte är klickvärdet. Amerikanska tillverkare
        anger nästan alltid i MOA, och på jaktmodeller är 1/4 MOA per klick det klart vanligaste.
        Kontrollera ändå på din egen ratt — det förekommer både 1/2 MOA och modeller i MRAD.
      </p>

      <h2>Vad 1/4 MOA betyder i centimeter</h2>

      <p>
        En MOA är 2,91 cm på 100 meter, så ett klick på 1/4 MOA flyttar träffpunkten ungefär{' '}
        <strong>0,73 cm på 100 meter</strong>. På andra avstånd:
      </p>

      <ul>
        <li>50 meter: cirka 0,36 cm per klick</li>
        <li>100 meter: cirka 0,73 cm per klick</li>
        <li>150 meter: cirka 1,09 cm per klick</li>
        <li>200 meter: cirka 1,45 cm per klick</li>
      </ul>

      <p>
        Sitter din medelträffpunkt 5 cm för högt på 100 meter blir det 5 / 0,73 ≈ 6,8 — alltså 7
        klick ner. Fler avstånd och klickvärden finns i tabellen i{' '}
        <Link href="/artiklar/moa-och-mil">artikeln om MOA och MIL</Link>.
      </p>

      <Callout title="Slipp räkna">
        <p>
          <Link href="/">Verktyget</Link> har 1/4 MOA som förval och räknar om åt dig när du fyller
          i avstånd och avvikelse. Det visar också hur mycket som blir kvar efter avrundningen till
          hela klick — med 1/4 MOA handlar det om någon tiondels centimeter, alltså inget att bry
          sig om.
        </p>
      </Callout>

      <h2>Rattar med lock och rattar utan</h2>

      <p>
        Många av Leupolds jaktmodeller har skyddslock över rattarna. De är tänkta att skruvas av
        vid inskjutning och sedan sitta på under jakten, så att inget råkar vridas i väskan eller
        i bilen.
      </p>

      <p>
        Modeller för längre håll har i stället öppna rattar avsedda att vridas under skjutningen,
        ofta med en spärr som hindrar att man av misstag går under grundnollan.
      </p>

      <h2>Skräddarsydd ballistisk ratt</h2>

      <p>
        Leupold erbjuder ballistiska rattar som tillverkas efter din ammunition och dina
        förhållanden, märkta i avstånd i stället för i klick. En sådan ratt bygger helt på att
        vapnet är korrekt inskjutet på grundavståndet, och på att de uppgifter om laddningen som
        ratten beställts efter stämmer.
      </p>

      <ul>
        <li>Skjut in noggrant på grundavståndet innan du använder skalan.</li>
        <li>Nollställ ratten i det inskjutna läget.</li>
        <li>
          Kontrollera att ratten står på noll innan du börjar skjuta. En ratt som står kvar på ett
          längre avstånd ger höga träffar som lätt misstas för en tappad nolla.
        </li>
        <li>
          Byter du ammunition gäller inte längre skalan, även om grundnollan skulle råka stämma.
        </li>
      </ul>

      <h2>Nollställa ratten efter inskjutningen</h2>

      <ol>
        <li>Skjut in klart och bekräfta med en grupp om tre skott.</li>
        <li>Lossa skruven eller skruvarna i rattens ovansida enligt manualen för din modell.</li>
        <li>Vrid sifferskalan till noll utan att mekanismen följer med.</li>
        <li>Dra åt och skjut ett kontrollskott.</li>
      </ol>

      <h2>Steg för steg</h2>

      <ol>
        <li>Kontrollera montaget — siktet ska sitta absolut fast.</li>
        <li>Ställ in dioptern mot ditt öga.</li>
        <li>Skruva av rattarnas lock.</li>
        <li>Grovrikta på kort håll om siktet är nymonterat.</li>
        <li>Skjut tre skott och räkna ut gruppens medelträffpunkt.</li>
        <li>
          Mata in avvikelsen i <Link href="/">verktyget</Link> med 1/4 MOA valt, eller det värde
          din ratt anger.
        </li>
        <li>Vrid, bekräfta med en kontrollgrupp, nollställ och sätt tillbaka locken.</li>
      </ol>

      <p>
        Hela gången med förberedelser och vanliga fel finns i{' '}
        <Link href="/artiklar/skjuta-in-kikarsikte">guiden om att skjuta in kikarsiktet</Link>. Om
        du inte får någon träff på pappret alls, börja med{' '}
        <Link href="/artiklar/utanfor-tavlan">artikeln om att hitta tillbaka till tavlan</Link>.
      </p>

      <h2>Vanliga frågor</h2>

      <h3>Hur många centimeter är ett klick på mitt Leupold?</h3>
      <p>
        Har du 1/4 MOA flyttar ett klick cirka 0,73 cm på 100 meter. Kontrollera värdet på ratten
        — det förekommer även 1/2 MOA och MRAD.
      </p>

      <h3>Varför står det MOA och inte centimeter?</h3>
      <p>
        MOA är en vinkelenhet som används genomgående på den amerikanska marknaden. Den fungerar
        precis lika bra, men kräver en omräkning till centimeter när du mäter på tavlan.
      </p>

      <h3>Kan jag använda en ballistisk ratt med annan ammunition?</h3>
      <p>
        Nej. Skalan är räknad för en bestämd laddning. Byter du ammunition stämmer avstånden inte
        längre, och du behöver både skjuta om och skaffa en ny skala.
      </p>
    </ArticleLayout>
  )
}

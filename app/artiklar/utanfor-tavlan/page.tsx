import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleLayout, Callout } from '@/components/article-layout'
import { getArticle } from '@/lib/articles'

const article = getArticle('utanfor-tavlan')!

export const metadata: Metadata = {
  title: article.metaTitle ?? article.title,
  description: article.description,
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Vad gör jag om jag inte träffar måltavlan alls?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gå närmare, till 15–25 meter, och gör måltavlan mycket större genom att sätta upp en stor kartong bakom. Då hamnar skottet på pappret och du ser åt vilket håll du ska vrida. Kan du ta ur slutstycket kan du också grovrikta genom loppet innan du skjuter.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hur grovriktar man ett kikarsikte genom loppet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ta ur slutstycket, lägg vapnet stadigt och titta genom loppet tills målet syns mitt i. Rör sedan inte vapnet, utan vrid siktets rattar tills riktmedlet pekar på samma punkt.',
      },
    },
    {
      '@type': 'Question',
      name: 'Varför tar träffpunkten inte slut när jag vrider?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Då kan siktet ha nått slutet på sitt justeringsområde, eller sitta i ett montage som pekar fel. Lösningen är ett montage med justering eller shims, inte fler klick.',
      },
    },
  ],
}

export default function Page() {
  return (
    <ArticleLayout
      article={article}
      lead="Du skjuter, går fram — och pappret är orört. Nu vet du varken hur långt fel du är eller åt vilket håll, och varje nytt skott är en gissning. Här är hur du tar dig ur det, oftast på ett eller två skott."
      extraJsonLd={faqJsonLd}
    >
      <p>
        Det här är den vanligaste anledningen till att en inskjutning äter en hel ask ammunition.
        Problemet är inte att siktet sitter fel — det är att du saknar information. Så länge du
        inte ser var kulan tar kan du inte räkna på något, och då blir det gissningar.
      </p>

      <p>
        Allt nedan handlar därför om samma sak: <strong>få syn på träffen</strong>. När du väl vet
        var den sitter är resten en halv minuts räknande.
      </p>

      <h2>Först: är du säker på att du missade?</h2>

      <p>Innan du ändrar något, uteslut de tråkiga förklaringarna.</p>

      <ul>
        <li>
          <strong>Sköt du mot rätt tavla?</strong> På en bana med flera ramar bredvid varandra
          händer det oftare än man tror. Gå fram och titta på grannarna också.
        </li>
        <li>
          <strong>Sitter hålet i kanten?</strong> Ett hål i den yttersta centimetern av pappret är
          lätt att missa, särskilt i dåligt ljus.
        </li>
        <li>
          <strong>Syns nedslaget i kulfånget?</strong> Sand, snö eller jord bakom tavlan visar
          ofta var kulan tog. Det räcker för att veta åt vilket håll du ska vrida.
        </li>
      </ul>

      <h2>1. Gå närmare</h2>

      <p>
        Det enskilt mest effektiva. Flytta fram till 15 eller 25 meter. En vinkelavvikelse som
        gör att du missar hela tavlan på 100 meter ger bara en fjärdedel så stor avvikelse i
        centimeter på 25 meter — och då hamnar skottet nästan alltid på pappret.
      </p>

      <p>
        Kontrollera först att banans regler tillåter det och att kulfånget är avsett för det
        avståndet. Fråga banvakten om du är osäker.
      </p>

      <p>
        Räkna med att träffen sitter en bit under riktpunkten på så kort håll. Kikarsiktet sitter
        flera centimeter ovanför pipan och kulan har inte hunnit upp genom siktlinjen än. Det är
        normalt och inget du ska justera bort — målet här är bara att komma in på pappret.
      </p>

      <h2>2. Gör måltavlan mycket större</h2>

      <p>
        En A4 är 21 centimeter bred. Är du 30 centimeter fel spelar det ingen roll hur bra tavlan
        är. Sätt upp något stort bakom den:
      </p>

      <ul>
        <li>En hel kartong, utvikt och uppsatt på ramen</li>
        <li>Ett par sammantejpade papper, gärna en halv kvadratmeter eller mer</li>
        <li>Ett stort papper med bara ett kryss eller en tejpbit i mitten som riktpunkt</li>
      </ul>

      <p>
        Poängen är inte att kunna mäta exakt — det gör du senare på en riktig tavla. Poängen är
        att se hålet överhuvudtaget.
      </p>

      <Callout title="Kombinera gärna">
        <p>
          Stor kartong <em>och</em> kort avstånd samtidigt löser i princip alltid problemet. Har du
          ett sikte som är monterat helt galet är det den kombinationen som tar dig in på ett skott
          i stället för fem.
        </p>
      </Callout>

      <h2>3. Grovrikta genom loppet</h2>

      <p>
        Det här är det klassiska tricket och kostar noll skott. Det fungerar på vapen där du kan
        se rakt genom pipan — de flesta studsare med uttagbart slutstycke, och brytvapen.
      </p>

      <ol>
        <li>Plocka ur slutstycket och kontrollera att vapnet är oladdat.</li>
        <li>
          Lägg vapnet mycket stadigt på säckar eller i ett stöd, så att det ligger still av sig
          självt.
        </li>
        <li>
          Titta genom loppet från bakändan och peta vapnet på plats tills måltavlans mitt syns
          mitt i pipan.
        </li>
        <li>
          <strong>Rör nu inte vapnet.</strong> Titta genom siktet i stället och se var riktmedlet
          pekar.
        </li>
        <li>
          Vrid rattarna tills riktmedlet pekar på samma punkt som loppet gjorde. Kontrollera
          genom loppet emellanåt så att vapnet inte flyttat sig.
        </li>
      </ol>

      <p>
        Efter det pekar sikte och pipa åt ungefär samma håll, och första skottet brukar hamna
        inom någon decimeter. Det är grovriktning, inte inskjutning — men det tar dig in på
        tavlan.
      </p>

      <h2>4. Laserpatron eller kollimator</h2>

      <p>
        Fungerar inte loppet — halvautomater, vapen med långa ljuddämpare, eller om du helt
        enkelt inte får plats — finns hjälpmedel:
      </p>

      <ul>
        <li>
          <strong>Laserpatron.</strong> En patronformad enhet i din kaliber som läggs i patronläget
          och skickar en laserstråle ut genom loppet. Rikta siktet mot laserpricken på tavlan.
        </li>
        <li>
          <strong>Kollimator.</strong> Sätts på mynningen och visar ett rutmönster i siktet som du
          centrerar riktmedlet mot.
        </li>
      </ul>

      <p>
        Båda tar dig till samma ställe som grovriktning genom loppet: nära nog för att komma in på
        pappret. Ingen av dem ersätter att skjuta.
      </p>

      <h2>5. Ettskottsmetoden</h2>

      <p>
        Har du väl fått ett hål i pappret finns det ett sätt att bli klar på i princip ett enda
        skott till. Det kräver att vapnet ligger riktigt stadigt.
      </p>

      <ol>
        <li>Lägg vapnet i ett stöd som håller det stilla av sig självt, inte bara med dina händer.</li>
        <li>Sikta mitt på tavlan och skjut ett skott.</li>
        <li>
          Lägg tillbaka vapnet i exakt samma läge och rikta riktmedlet på{' '}
          <strong>den ursprungliga riktpunkten</strong> igen.
        </li>
        <li>
          Håll vapnet absolut stilla — gärna med hjälp av någon — och vrid sedan rattarna tills
          riktmedlet står mitt i kulhålet.
        </li>
        <li>Nu pekar siktet dit kulan faktiskt gick. Skjut ett kontrollskott och bekräfta.</li>
      </ol>

      <p>
        Metoden står och faller med att vapnet inte rör sig medan du vrider. Rör det sig en
        aning blir resultatet därefter — men du är ändå mycket närmare än du var.
      </p>

      <h2>När det inte hjälper att vrida</h2>

      <p>
        Har du vridit ett stort antal klick utan att träffpunkten följer med är det inte
        inställningen som är problemet:
      </p>

      <ul>
        <li>
          <strong>Siktet kan ha nått slutet på sitt justeringsområde.</strong> Rattarna tar fysiskt
          slut, och då händer ingenting hur mycket du än vrider. Lösningen är ett montage med
          justering, shims eller en bas med inbyggd lutning — inte fler klick.
        </li>
        <li>
          <strong>Montaget kan peka fel.</strong> Fel bas för ditt vapen, eller ringar som inte
          sitter i linje, gör att siktet måste stå långt ut i sitt område redan från början.
        </li>
        <li>
          <strong>Något kan glappa.</strong> Kontrollera skruvarna i bas och ringar. Ett montage
          som rör sig ger en träffpunkt som vandrar oberoende av vad du gör.
        </li>
        <li>
          <strong>Siktet kan vara trasigt.</strong> Ovanligt, men det förekommer, särskilt efter ett
          fall. Testa genom att vrida ett känt antal klick och mäta om träffpunkten flyttar sig
          så mycket som den ska.
        </li>
      </ul>

      <h2>Vanliga orsaker till att man hamnar långt utanför</h2>

      <ul>
        <li>Nymonterat sikte som aldrig grovriktats.</li>
        <li>Siktet har varit av och på igen.</li>
        <li>Bytt vapen men behållit siktet.</li>
        <li>Någon annan har skruvat på rattarna.</li>
        <li>Ballistisk ratt som står kvar på en inställning för ett längre avstånd.</li>
        <li>Vapnet har ramlat eller fått en ordentlig smäll.</li>
      </ul>

      <h2>När du väl är inne på pappret</h2>

      <p>
        Då är det vanliga gången som gäller: flytta ut till ditt riktiga avstånd, skjut en grupp
        om tre skott, och justera mot gruppens medelträffpunkt i stället för mot ett enskilt hål.
      </p>

      <p>
        Mata in avvikelsen i <Link href="/">verktyget</Link> så får du antalet klick och åt vilket
        håll. Hela gången finns i{' '}
        <Link href="/artiklar/skjuta-in-kikarsikte">guiden om att skjuta in kikarsiktet</Link>, och{' '}
        <Link href="/artiklar/lasa-traffbilden">artikeln om träffbilden</Link> förklarar varför
        gruppen är viktigare än det enskilda skottet.
      </p>

      <h2>Vanliga frågor</h2>

      <h3>Hur nära kan jag gå?</h3>
      <p>
        15 till 25 meter räcker gott för att komma in på pappret. Kortare än så blir avvikelsen i
        centimeter så liten att den är svår att mäta, och du får ändå inget användbart besked om
        nollan.
      </p>

      <h3>Kan jag grovrikta med en halvautomat?</h3>
      <p>
        Inte genom loppet, eftersom du inte ser igenom. Använd laserpatron eller kollimator, eller
        gå den enkla vägen: kort avstånd och en stor kartong.
      </p>

      <h3>Hur många klick ska jag chansa på?</h3>
      <p>
        Inga. Chansningar är precis det som gör att man skjuter upp en hel ask utan att bli klar.
        Skaffa informationen först — se träffen — och räkna sedan.
      </p>

      <h3>Träffar jag lägre på kort håll?</h3>
      <p>
        Ja, oftast. Kulan lämnar loppet under siktlinjen och stiger sedan upp genom den. På 15–25
        meter har den sällan hunnit ikapp. Mer om det i{' '}
        <Link href="/artiklar/skjuta-in-pa-50-meter">artikeln om inskjutning på kort avstånd</Link>.
      </p>
    </ArticleLayout>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleLayout, Callout } from '@/components/article-layout'
import { getArticle } from '@/lib/articles'

const article = getArticle('skjuta-in-kikarsikte')!

export const metadata: Metadata = {
  title: article.metaTitle ?? article.title,
  description: article.description,
}

const steps = [
  'Kontrollera att montaget sitter fast innan du åker.',
  'Ställ upp stadigt på säckar eller bänkstöd.',
  'Grovrikta på kort håll, 25 meter, tills du är på pappret.',
  'Flytta till ditt riktiga inskjutningsavstånd.',
  'Skjut tre skott och räkna ut gruppens medelträffpunkt.',
  'Vrid det antal klick verktyget anger.',
  'Skjut en kontrollgrupp och bekräfta att den sitter rätt.',
]

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Skjuta in kikarsiktet',
  description: article.description,
  inLanguage: 'sv-SE',
  step: steps.map((text, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    text,
  })),
}

export default function Page() {
  return (
    <ArticleLayout
      article={article}
      lead="Ett kikarsikte som sitter fel gör ingen nytta, hur bra det än är. Här är hela gången från monterat sikte till bekräftad nolla — utan att bränna en ask ammunition på gissningar."
      extraJsonLd={howToJsonLd}
    >
      <p>
        Att skjuta in ett kikarsikte handlar om en enda sak: att få kulan att träffa där
        riktmedlet pekar, på ett avstånd du valt. Allt annat — stöd, ammunition, tålamod — är
        till för att du ska kunna se om det stämmer.
      </p>

      <p>
        Det som gör många frustrerade är inte själva justeringen utan att de inte vet om skottet
        som satt snett berodde på siktet eller på dem själva. Den här guiden är upplagd för att
        ta bort den osäkerheten steg för steg.
      </p>

      <h2>Innan du åker: kontrollera montaget</h2>

      <p>
        Ett glappande montage är den vanligaste orsaken till ett sikte som &quot;inte går att
        skjuta in&quot;. Träffpunkten vandrar några centimeter för varje serie och man kan vrida
        hur mycket som helst utan att bli klar.
      </p>

      <ul>
        <li>
          Ta tag i siktet och försök vrida det i ringarna. Det ska inte röra sig alls.
        </li>
        <li>
          Kontrollera att skruvarna i bas och ringar är dragna enligt tillverkarens angivna
          moment. För hårt är lika illa som för löst — ett överdraget rör kan klämmas.
        </li>
        <li>
          Se efter att siktet sitter i våg. Ett sikte som lutar ger en träffpunkt som vandrar i
          sidled när avståndet ökar.
        </li>
        <li>
          Ställ in dioptern på ditt öga: rikta mot en ljus, jämn yta och vrid okularet tills
          riktmedlet är knivskarpt direkt när du tittar in. Gör det innan du skjuter, inte
          mellan skotten.
        </li>
      </ul>

      <h2>Utrustning du behöver</h2>

      <ul>
        <li>
          <strong>Stadigt stöd.</strong> Sandsäckar, ett bänkstöd eller en fylld ryggsäck.
          Ostadigt stöd ger spridning som du annars felaktigt skyller på siktet.
        </li>
        <li>
          <strong>En måltavla med rutnät.</strong> Då kan du räkna rutor i stället för att mäta
          med linjal vid tavlan. Våra{' '}
          <Link href="/maltavlor">måltavlor med centimeterrutnät</Link> är gjorda för det.
        </li>
        <li>
          <strong>Samma ammunition som du ska jaga eller tävla med.</strong> Olika kultyper och
          laddningar träffar olika. Skjuter du in med en sort och jagar med en annan är du inte
          inskjuten.
        </li>
        <li>
          <strong>Något att anteckna med</strong> — eller mobilen, om du använder{' '}
          <Link href="/">verktyget</Link>, som sparar passen åt dig.
        </li>
      </ul>

      <h2>Steg 1: Grovrikta på kort håll</h2>

      <p>
        Börja på 25 meter. Poängen är inte att bli klar där utan att komma in på pappret, och det
        gör du med betydligt färre skott på kort håll. Ett sikte som är riktigt fel kan missa
        hela tavlan på 100 meter, och då vet du inte ens åt vilket håll du ska vrida.
      </p>

      <p>
        Har du ett vapen där slutstycket går att ta ur kan du grovrikta helt utan att skjuta:
        lägg vapnet stadigt, titta genom loppet och rikta det mot måltavlans mitt, och vrid sedan
        siktet tills riktmedlet pekar på samma punkt. Det sparar ofta de tre-fyra första skotten.
      </p>

      <Callout title="Räkna med att kulan sitter lågt på 25 meter">
        <p>
          Kikarsiktet sitter flera centimeter ovanför pipan. Kulan lämnar loppet under
          siktlinjen och stiger sedan upp mot den. På 25 meter har den oftast inte hunnit ikapp,
          så en träff en bit under mitten är helt normalt och betyder inte att något är fel.
        </p>
        <p>
          Hur mycket beror på ditt vapen, din ammunition och hur högt siktet sitter. Därför är 25
          meter bara ett sätt att komma in på tavlan — den riktiga inskjutningen gör du på ditt
          verkliga avstånd.
        </p>
      </Callout>

      <h2>Steg 2: Flytta till ditt riktiga avstånd</h2>

      <p>
        För de flesta jaktvapen är 100 meter standard. Har du bara en kortare bana går det att
        skjuta in på 50 meter — men inte genom att helt enkelt halvera avvikelsen. Det förklarar
        vi i{' '}
        <Link href="/artiklar/skjuta-in-pa-50-meter">
          artikeln om inskjutning på 50 meter
        </Link>
        .
      </p>

      <h2>Steg 3: Skjut en grupp, inte ett skott</h2>

      <p>
        Det här är det viktigaste steget, och det som oftast hoppas över. Ett enskilt skott säger
        nästan ingenting. Även en bra skytt med ett bra vapen får en viss spridning, och om du
        justerar efter ett skott justerar du lika gärna bort en slump.
      </p>

      <p>
        Skjut tre skott mot samma riktpunkt. Ta det lugnt mellan skotten och låt pipan svalna —
        en varm pipa kan flytta träffpunkten. Titta sedan inte på varje hål för sig utan på
        gruppens mitt, medelträffpunkten. Det är den du ska flytta till mitten av tavlan.
      </p>

      <p>
        Verktyget räknar ut medelträffpunkten åt dig när du lägger in flera skott, och visar
        samtidigt hur stor gruppen är i centimeter och MOA. Vill du veta vad de siffrorna säger,
        läs{' '}
        <Link href="/artiklar/lasa-traffbilden">om hur du läser träffbilden</Link>.
      </p>

      <h2>Steg 4: Räkna ut hur många klick</h2>

      <p>
        Ett klick på siktet flyttar träffpunkten en bestämd vinkel, inte ett bestämt antal
        centimeter. Därför beror antalet klick både på hur långt fel du sitter och på hur långt
        bort tavlan står. Formeln är:
      </p>

      <pre>
        <code>{`cm per klick = klickvärdet på 100 m × (avståndet / 100)
antal klick  = avvikelsen i cm / cm per klick`}</code>
      </pre>

      <p>
        Ett sikte med 1/4 MOA flyttar ungefär 0,73 cm per klick på 100 meter. Sitter din
        medelträffpunkt 4 cm till höger blir det 4 / 0,73 ≈ 5,5 klick, alltså 5 eller 6 klick åt
        vänster. På 200 meter hade samma avvikelse krävt hälften så många klick, och på 50 meter
        dubbelt så många.
      </p>

      <p>
        Vet du inte vad ditt sikte har för klickvärde står det oftast på rattarna eller i
        manualen. Vad de olika beteckningarna betyder går vi igenom i{' '}
        <Link href="/artiklar/moa-och-mil">artikeln om MOA och MIL</Link>.
      </p>

      <p>
        Slipper du räkna själv: mata in avvikelsen i{' '}
        <Link href="/">inskjutningsverktyget</Link> så får du antalet klick och åt vilket håll
        direkt.
      </p>

      <h2>Steg 5: Vrid åt rätt håll</h2>

      <p>
        Rattarna är märkta med riktningen träffpunkten flyttas, inte riktningen du vill flytta
        kulan ifrån. Höjdratten sitter upptill och sidoratten på höger sida. Står det{' '}
        <strong>UP</strong> med en pil betyder det att träffpunkten går uppåt om du vrider åt det
        hållet, och <strong>R</strong> att den går åt höger.
      </p>

      <p>
        Sitter träffen alltså <em>högt</em> ska du vrida <em>ner</em>, och sitter den till{' '}
        <em>höger</em> vrider du åt <em>vänster</em>. Det låter självklart men är det enklaste
        felet att göra, särskilt när man står kall och har bråttom. Verktyget skriver ut
        riktningen i klartext just därför.
      </p>

      <Callout title="Om träffpunkten inte rör sig som den ska">
        <p>
          Vissa sikten, framför allt enklare modeller, kan behöva &quot;sätta sig&quot; efter en
          stor justering. Har du vridit många klick utan att träffpunkten följer med kan ett par
          lätta knackningar på siktrörets ovansida hjälpa mekanismen på plats. Skjut sedan ett
          nytt skott innan du drar några slutsatser.
        </p>
        <p>
          Följer träffpunkten fortfarande inte med är det oftare montaget än siktet som är fel.
          Gå tillbaka till kontrollen längst upp.
        </p>
      </Callout>

      <h2>Steg 6: Bekräfta med en kontrollgrupp</h2>

      <p>
        Vrid klicken och skjut sedan tre nya skott. Sitter gruppen där du ville är du klar. Ett
        enda kontrollskott räcker inte — det kan hamna rätt av ren tur.
      </p>

      <p>
        Många nollställer också rattarna efteråt, så att de visar noll i inskjutet läge. Då vet
        du alltid var du utgick ifrån om du behöver vrida på jakten och sedan tillbaka.
      </p>

      <h2>Vanliga fel</h2>

      <ul>
        <li>
          <strong>Justera efter ett enda skott.</strong> Du jagar spridningen i stället för att
          flytta träffpunkten.
        </li>
        <li>
          <strong>Varm pipa.</strong> Skjuter du tio skott i rad flyttar sig träffpunkten på
          många vapen. Låt pipan svalna mellan serierna.
        </li>
        <li>
          <strong>Otydligt stöd.</strong> Vilar pipan direkt mot något hårt ändras träffbilden.
          Låt stödet ta mot stocken, inte mot pipan.
        </li>
        <li>
          <strong>Olika kindstöd mellan skotten.</strong> Flyttar du ögat i förhållande till
          siktet ändras riktpunkten. Lägg kinden på samma ställe varje gång.
        </li>
        <li>
          <strong>Byta ammunition efter inskjutningen.</strong> Ny kultyp betyder ny
          inskjutning.
        </li>
        <li>
          <strong>Måltavla utskriven i fel skala.</strong> Skriv alltid ut i 100 %, annars mäter
          du fel från början. Våra tavlor har ett kontrollmått att mäta efter.
        </li>
      </ul>

      <h2>Vanliga frågor</h2>

      <h3>Hur många skott går det åt?</h3>
      <p>
        Med grovriktning på kort håll brukar det landa på tio till femton skott. Utan
        grovriktning, och om siktet sitter riktigt fel från början, kan det bli betydligt fler.
      </p>

      <h3>På vilket avstånd ska jag skjuta in?</h3>
      <p>
        100 meter är det vanligaste för kulvapen och fungerar för de flesta jaktsituationer.
        Skjuter du mest på kortare håll i tät skog kan 50 meter räcka gott.
      </p>

      <h3>Hur ofta behöver jag skjuta om?</h3>
      <p>
        Inför varje säsong, och alltid efter att vapnet fått en smäll, efter ombyggnad eller
        ommontering av siktet, och när du byter ammunition. Mer om det i{' '}
        <Link href="/artiklar/kontrollera-infor-jakten">
          artikeln om kontroll före jakten
        </Link>
        .
      </p>

      <h3>Kan jag skjuta in utan att skjuta?</h3>
      <p>
        Nej. Grovriktning genom loppet eller med ett lasermonterat hjälpmedel tar dig in på
        pappret, men den riktiga inskjutningen kräver att du ser var kulan faktiskt tar.
      </p>
    </ArticleLayout>
  )
}

# Inskjutning

Ett verktyg som räknar om var kulan träffade till antal klick på kikarsiktets
höjd- och sidoratt. Byggt för att användas i mobilen, vid bänken, med handskar på.

Live: [inskjutning.se](https://www.inskjutning.se)

## Så fungerar verktyget

1. Välj vapen (valfritt) — klickvärde, avstånd och önskad träffpunkt sparas per profil.
2. Markera träffen genom att trycka på måltavlan, eller skriv in avvikelsen i cm.
3. Läs av antalet klick i sida och höjd. Beräkningen uppdateras direkt.

### Funktioner

- **Interaktiv måltavla** — tryck eller dra för att placera skottet, zooma mellan ±5 och ±80 cm.
- **Skottgrupp** — lägg in upp till 10 skott. Justeringen räknas mot gruppens
  medelträffpunkt (MPI), och gruppstorleken visas i både cm och MOA.
- **Vapenprofiler** — spara flera vapen med klickvärde, standardavstånd och önskad
  träffpunkt. Sparas lokalt i webbläsaren, ingen inloggning.
- **Inskjutningslogg** — spara beräkningar per vapen och exportera till CSV.
- **Säkerhetskopiering** — spara alla vapen och pass till en JSON-fil och läs in
  dem igen på en ny telefon.
- **Klickvärden** — 1/8, 1/4, 1/3, 1/2 och 1 MOA, 0,05 och 0,1 MIL, cm-baserade
  sikten samt eget värde.
- **Önskad träffpunkt** — skjut in på ett avstånd men lägg nollan på ett annat,
  t.ex. 3 cm högt på 100 m.
- **Mörkt fältläge och ljust läge**, som följer systemet tills du väljer själv.
- **Installerbar app som fungerar offline** — se nedan.

## Installera på hemskärmen

Sajten är en PWA och kan läggas som en app-ikon på telefonen. Ingen app-butik
inblandad.

- **Android/Chrome:** en ruta erbjuder installation, annars ⋮ → *Installera app*.
- **iPhone/iPad (Safari):** dela-knappen → *Lägg till på hemskärmen*. iOS visar
  ingen egen ruta, så sidan tipsar om det själv en gång
  ([`components/install-prompt.tsx`](components/install-prompt.tsx)).

Installerad öppnas verktyget i helskärm och **fungerar utan täckning**:
beräkningar, måltavlan, vapenprofiler och loggen ligger helt i telefonen. Bara
artiklarna kräver uppkoppling.

Cachningen sköts av [`public/sw.js`](public/sw.js): sidor hämtas från nätet först
med cachen som reserv, byggfiler (hashade filnamn) från cachen först, och API,
admin och andra domäner cachas aldrig. Höj `VERSION` i filen om du någon gång
behöver tvinga bort all gammal cache hos användarna.

Service workern registreras bara i produktionsbygget, så testa med:

```bash
npm run build && npm run start
```

## Beräkningen

Ett klick flyttar träffpunkten en fast **vinkel**, inte ett fast antal centimeter:

```
cm per klick = klickvärde i cm på 100 m × (avstånd i meter / 100)
antal klick  = (önskad träffpunkt − medelträffpunkt) / cm per klick
```

1 MOA = 2,908882 cm på 100 m, 1 MIL (mrad) = 10 cm på 100 m. All logik ligger
samlad i [`lib/ballistics.ts`](lib/ballistics.ts) och är fri från UI-kod.

## Kom igång

```bash
npm install
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

Själva verktyget fungerar utan konfiguration. Artiklar, feedback och admin
använder Supabase och kräver följande variabler i `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Saknas de går bygget ändå igenom — artikellistan visas bara som tom.

## Säkerhetskopiering

Allt i verktyget ligger i webbläsarens `localStorage`. Det försvinner när man
byter telefon, rensar webbplatsdata eller — på iPhone — inte besökt sajten på
en vecka (Safari rensar skrivbar lagring automatiskt; en installerad
hemskärmsapp är undantagen).

Panelen under loggen exporterar allt till en JSON-fil och läser in den igen.
Inläsningen **slår ihop** i stället för att skriva över: poster med samma id
räknas som samma sak och den befintliga vinner, så en inläsning kan aldrig
förstöra något som redan finns. Loggen kapas vid `MAX_LOG_ENTRIES` (100) med de
nyaste kvar.

Filen kommer utifrån och granskas post för post i
[`lib/backup.ts`](lib/backup.ts): fel typ förkastas, tal utanför rimliga
gränser klipps, texter kortas och okända klickvärden faller tillbaka på
standard. Det som inte håller hoppas över i stället för att välta importen.

På mobilen används delningsrutan (Web Share API) när den finns, eftersom vanlig
nedladdning inte fungerar i en installerad app på iPhone.

CSV-exporten i loggen är något annat: den är till för kalkylprogram och går
inte att läsa tillbaka.

## Artiklar

Artiklarna ligger som egna sidor under `app/artiklar/<slug>/` och listas i
[`lib/articles.ts`](lib/articles.ts). Registret är källan för artikelöversikten,
sitemapen, "läs vidare"-länkarna och guideblocket på startsidan — lägg till en
post där och sidan syns överallt automatiskt.

En ny artikel:

1. Lägg till en post i `lib/articles.ts` (slug, titel, metabeskrivning, ingress,
   datum, lästid, ämnen).
2. Skapa `app/artiklar/<slug>/page.tsx` som använder
   [`ArticleLayout`](components/article-layout.tsx). Layouten sköter rubrik,
   datum, brödtextens typografi, strukturerad data, uppmaningen till verktyget
   och relaterade artiklar.
3. Skriv brödtexten som vanlig HTML i JSX — `prose`-klasserna sätter
   typografin. `Callout` ger en faktaruta som bryter ut ur texten.

Skicka med `extraJsonLd` för `HowTo` eller `FAQPage` när artikeln passar det —
det är de två typerna som ger utökade sökresultat.

Artiklar som skrivs i admin hamnar i databasen och visas på samma lista via
`/artiklar/[slug]`.

## Måltavlor

Fyra tavlor i A4 ligger i `public/maltavlor/` och genereras av
[`scripts/generate-targets.py`](scripts/generate-targets.py):

| Tavla | Rutor | Rutnät | Räckvidd från siktpunkten |
|---|---|---|---|
| Precision | 1 cm | 18 × 22 cm | ±9 × ±11 cm |
| Jakt | 2 cm | 16 × 20 cm | ±8 × ±10 cm |
| Fyra grupper | 1 cm | 4 × (8 × 10 cm) | ±4 × ±5 cm |
| Sex små | 1 cm | 6 × (8 × 6 cm) | ±4 × ±3 cm |

PDF:erna skrivs direkt, byte för byte, av
[`scripts/pdfkit.py`](scripts/pdfkit.py) — inga beroenden. Skälet är
måttnoggrannhet: ett rutnät som inte är exakt en centimeter gör tavlan
oanvändbar, eftersom man räknar rutor och matar in centimeter i verktyget. Varje
tavla har ett kontrollmått på 10 cm i nederkanten som avslöjar en utskrift som
skrivaren skalat om.

Rutnätens halva bredd och höjd måste vara jämnt delbara med rutstorleken,
annars blir det halva rutor längs kanten. `npm run test:targets` mäter
PDF:erna och kontrollerar det, tillsammans med sidformat och kontrollmått.

Ändra eller lägg till en tavla i `scripts/generate-targets.py` och kör:

```bash
npm run targets       # skriver om PDF:erna
npm run test:targets  # kontrollerar måtten
```

Förhandsbilderna på sajten (`maltavla-*.png`, 1131 × 1600) görs med
`qlmanage -t -s 1600 -o . maltavla-*.pdf`. De används både som miniatyr i korten
och i storvisningen, så next/image skalar ner dem där det behövs.

[`components/target-gallery.tsx`](components/target-gallery.tsx) visar korten och
en storvisning man öppnar genom att trycka på en tavla. Eftersom tavlorna är
stående A4 och de flesta skärmar är liggande ligger texten vid sidan om bilden
på breda skärmar — då får bilden hela fönsterhöjden i stället för att klämmas
ihop under en rubrik. Piltangenter bläddrar mellan tavlorna, Escape stänger.

## Test

```bash
npm test               # kör allt

npm run test:sw        # service workerns cachningsregler
npm run test:backup    # granskning och sammanslagning av säkerhetskopior
npm run test:targets   # måltavlornas mått i PDF:erna
```

## Kodstruktur

```
app/                     Sidor (App Router)
  page.tsx               Startsida med verktyget, "så gör du" och FAQ
  maltavlor/             Utskrivbara måltavlor
  artiklar/, kontakt/    Innehållssidor
  admin/, api/           Inloggningsskyddad admin och API (Supabase)
components/
  calculator.tsx         Verktyget: profiler, skott, inställningar, logg
  target-plot.tsx        Interaktiv SVG-måltavla
  adjustment-result.tsx  Resultatpanelen med klick och statistik
  shot-log.tsx           Inskjutningsloggen med CSV-export
  ui/                    shadcn/ui-primitiver
  install-prompt.tsx     Tipset om att lägga appen på hemskärmen
  backup-panel.tsx       Export och import av vapen och logg
lib/
  ballistics.ts          Alla beräkningar (ren TypeScript, inga beroenden)
  storage.ts             Vapenprofiler och logg i localStorage
  backup.ts              Säkerhetskopior: granskning och sammanslagning
public/
  sw.js                  Service worker för offline-läget
  icons/                 App-ikoner för hemskärmen
  maltavlor/             Utskrivbara måltavlor (PDF) med förhandsbilder
scripts/
  pdfkit.py              Minimal PDF-skrivare, millimeternoggrann
  generate-targets.py    Bygger måltavlorna
tests/
  service-worker.test.mjs
  backup.test.mjs
  targets.test.py
```

## Teknik

Next.js 14 (App Router), TypeScript, Tailwind CSS, Radix UI/shadcn, Supabase.

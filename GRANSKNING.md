# Granskning av Inskjutning — buggar och förbättringsförslag

> **Föråldrad i delar.** Supabase är borttaget ur projektet (17 sep 2026) sedan
> databasen visat sig ha varit pausad sedan 6 dec 2024. Allt som rör admin,
> feedback, kontaktformulär, RLS och databasartiklar i avsnitt 1, 2, 4 och 7 är
> därför inte längre aktuellt. Avsnitt 3, 5 och 6 gäller fortfarande.

Genomgång 2026-09-06 av hela kodbasen: verktyget, innehållssidor, API, admin,
konfiguration och beroenden.

**Status:** avsnitt 1 och 2 (säkerhet och det som var trasigt) är åtgärdade i
koden. Ett steg återstår som bara kan göras i Supabase — se 1.6 och
SUPABASE-RLS.md (borttagen). Avsnitt 3–7 är kvar.

Prioritet: **P0** = åtgärda före nästa deploy · **P1** = trasigt eller
vilseledande för användaren · **P2** = kvalitet/städning · **P3** = idéer.

---

## 1. Säkerhet (P0) — ÅTGÄRDAT i koden

### 1.1 ✅ Next.js uppgraderad 14.2.14 → 14.2.35
Stänger CVE-2025-29927, där headern `x-middleware-subrequest` lät en klient
kliva förbi middleware och därmed förbi hela admin-skyddet. Verifierat: ett
anrop till `/admin/dashboard` med den headern omdirigeras nu till
inloggningen. `npm audit` gick från 22 sårbarheter (2 kritiska, 11 höga) till
8 (0 kritiska) — se "Kvar" nedan.

Dessutom bytt `getSession()` mot `getUser()` i middleware och API. getSession
läser bara kakan och litar på innehållet; getUser verifierar token mot
Supabase.

### 1.2 ✅ `PUT /api/articles/[id]` kräver nu inloggning
Verifierat: svarar `401` utan session. Validerar också att titel och slug
finns, och svarar `404` i stället för att krascha när artikeln inte finns.

### 1.3 ✅ `GET /api/feedback` kräver nu inloggning
Verifierat: `401` utan session. Använder dessutom den inloggade klienten i
stället för den anonyma nyckeln.

### 1.4 ✅ Validering och spärr på de öppna vägarna
`POST /api/feedback` och `POST /api/contact`: kräver rätt typ, max 2 000
respektive 3 000 tecken, och högst 5 inskick per timme och IP-adress
(`lib/rate-limit.ts`, svarar `429` med `Retry-After`). Verifierat med
testanrop.

Räknaren ligger i minnet, så varje serverinstans har sin egen. Det stoppar
vanliga bottar men inte en beslutsam avsändare — byt till Vercel KV eller
Upstash om det någonsin blir ett verkligt problem.

### 1.5 ✅ `/api/test-supabase` borttagen
Verifierat: svarar `404`.

### ⚠️ 1.6 KVAR — och bara du kan göra det: RLS i Supabase
Anon-nyckeln ligger i klartext i klientpaketet (verifierat). Vem som helst kan
kopiera den och prata direkt med databasen, helt utan att gå via sajtens API.
Inloggningskontrollerna ovan skyddar ytterdörren; RLS skyddar köksdörren.
**Båda behövs.** Färdig SQL och kontrollkommandon finns i
SUPABASE-RLS.md (borttagen).

### ⚠️ 1.7 KVAR — kvarvarande sårbarheter kräver större flytt
- `next` (hög): DoS via Image Optimizer `remotePatterns`. Gäller bara
  självhostade appar med fjärrbilder — ni kör på Vercel utan fjärrbilder.
  Fix kräver Next 16.
- `eslint-config-next`, `glob`, `brace-expansion` (höga): endast
  utvecklingsberoenden, följer inte med i produktionsbygget.
- `postcss` (hög): byggtid, kräver att man matar in fientlig CSS.
- `quill`/`react-quill` (måttlig XSS): admin-editorn, bakom inloggning, och
  innehållet saneras med DOMPurify vid visning. Riktig fix är att byta editor
  (se avsnitt 7).

---

## 2. Trasigt idag (P1) — ÅTGÄRDAT

### 2.1 ✅ Kontaktformuläret fungerar nu
`/api/contact` var aldrig byggd — varje inskick gav 404. Nu finns vägen, och
formuläret är omskrivet: fel och bekräftelse visas i gränssnittet i stället
för `alert()`, och den falsklarmande 5-sekundersspärren är ersatt med ett dolt
honeypot-fält. Verifierat både felvägen och bekräftelsevyn i webbläsaren.

Meddelandena hamnar i `feedback`-tabellen med rubriken `[Kontakt] Namn
<e-post>`, så de syns i admin utan att du behöver skapa en ny tabell. Vill du
ha en egen tabell är det ett insert-anrop att byta i
[app/api/contact/route.ts](app/api/contact/route.ts).

### 2.2 ✅ Okänd artikel-slug ger 404 i stället för 500
`notFound()` anropas när ingen artikel hittas. Verifierat.

### 2.3 ✅ Artiklar läsbara i mörkt läge
`dark:prose-invert` på artikelinnehållet, och Hawke-artikelns hårdkodade
`text-blue-600` och `bg-gray-900` utbytta mot temafärger. Saneringen flyttad
till servern, vilket också sparar JavaScript hos besökaren.

### 2.4 ✅ Meta-beskrivningen försvinner inte längre
Svaret från API:t översätts nu från `meta_description` till
`metaDescription` när artikeln laddas in i formuläret.

### 2.5 ✅ Sidtiteln städad
"Rubrik | Din Webbplats · Inskjutning" → "Rubrik · Inskjutning".

### 2.6 ✅ Hawke-artikeln syns i listan
Statiska artiklar listas nu tillsammans med dem från databasen.

### 2.7 ✅ Feedback-rutan pratar svenska
Och loggar inte längre användarnas text till serverkonsolen.

### 2.8 ✅ 404- och felsidor
[app/not-found.tsx](app/not-found.tsx) och [app/error.tsx](app/error.tsx) i
sajtens design, med väg tillbaka.

### Städat på köpet
- Döda dubbletten `/admin/articles/[id]/edit` borttagen.
- `/admin` omdirigerar till `/admin/dashboard` i stället för att visa en
  ostylad äldre vy som läste feedback med den anonyma nyckeln.
- Inloggningssidan och feedbacklistan översatta och lagda i sajtens design.
- Feedbackens tidsstämplar visar svensk lokaltid i stället för rå UTC.
- `Authorization: Bearer`-headern från admin-editorn borttagen (API:t läser
  kakan).

---

## 3. Buggar i det nya verktyget (P1–P2)

### 3.1 Inskrivet värde utanför zoomen gör skottet osynligt
Skriver man 30 cm i sidfältet när tavlan visar ±20 cm klipps skottet bort
och syns inte. Zoom in-knappen är spärrad, men ingen zoomar ut automatiskt.
**Åtgärd:** zooma ut till närmaste steg som rymmer alla skott när ett värde
skrivs in (och när man laddar ett loggat pass, se 5.4).

### 3.2 Tomt-läge visar fel förklaring
Är avståndet tomt eller 0 blir resultatet `null` och panelen säger "Markera
var kulan träffade på tavlan" — trots att skott finns. Rätt text är "Ange
avstånd till tavlan" (respektive "Ange klickvärde" vid eget värde utan tal).

### 3.3 Vid 10 skott tappas markeringen
`handleAddShot` sätter `activeShotId` till det nya skottets id även när
gränsen är nådd och inget läggs till. Aktiv ring försvinner och fälten visar
skott 1 utan markering. Ingen förklaring om att gränsen är nådd.

### 3.4 Sifferfältet visar punkt, resten av appen komma
`SignedCmField` skriver tillbaka `"2.3"` när man drar skottet, medan alla
andra tal formateras svenskt (`2,3`). Konsekvent komma vore rätt.

### 3.5 Vertikala pilar vickar i sidled
`animate-nudge-x` ligger på både höger/vänster- och upp/ner-pilarna i
resultatkorten. Upp/ner borde vicka vertikalt eller inte alls.

### 3.6 "Töm loggen" och papperskorgen saknar bekräftelse och ångra
Ett feltryck raderar hela loggen permanent. Minst en bekräftelse; helst en
toast med "Ångra".

### 3.7 Inställningar sparas bara om en profil är aktiv
Utan profil återställs avstånd, klickvärde och önskad träffpunkt vid varje
omladdning. Spara "senast använda inställningar" separat.

### 3.8 Blink av standardvärden vid laddning
Profilen läses från `localStorage` i en effekt efter första renderingen, så
100 m / 1/4 MOA / "Välj vapen" syns en bråkdels sekund innan rätt värden slår
in. En enkel skelett-vy tills `hydrated` är sann löser det.

### 3.9 Tavlan blockerar scroll på mobil
`touch-none` på SVG:n är nödvändigt för att kunna dra skott, men betyder att
sidan inte går att scrolla om fingret börjar på tavlan. På en liten telefon
med tavlan i fullbredd finns lite yta kvar. Alternativ: `touch-action:
pan-y` och stäng av scroll bara när ett drag börjar på ett skott.

### 3.10 Avrundning vid exakt halva klick är osymmetrisk
`Math.round(-2,5)` blir −2 men `Math.round(2,5)` blir 3. Sällsynt, men
höger och vänster behandlas olika. Använd "avrunda bort från noll".

### 3.11 Skräpvärde i loggen vid eget klickvärde utan tal
Väljer man "Eget värde…" och sparar innan man skrivit något får loggen
etiketten "0,00 cm/klick @ 100 m" och profilen sparar `null`. Blockera
sparning tills värdet är giltigt.

### 3.12 Installationstipset visas överallt
Även på desktop och på admin-sidorna. Texten pratar om "banan", vilket är
lite fel på en stationär dator. Begränsa till pekskärm/mobil och till
verktygssidorna.

### 3.13 Vid deploy kan offline-läget halta tillfälligt
Service workern cachar startsidans HTML. Efter en ny deploy kan en användare
som är offline ha gammal HTML som pekar på chunk-filer som inte hunnit cachas
(om de aldrig laddades). Sällsynt; lösningen är att förcacha de chunkar
startsidan refererar till vid `install`, eller använda `next-pwa`/Serwist.

### 3.14 CSV-exporten på iPhone
`a.download` fungerar dåligt i Safari på iOS och inte alls i en installerad
PWA. Använd Web Share API (`navigator.share({ files })`) när det finns, med
nedladdning som reserv.

### 3.15 Tangentbordet når inte tavlan
`role="application"` men inga tangentbordshändelser. Sifferfälten täcker
behovet, men piltangenter som knuffar aktivt skott 0,1 cm vore bra för
precision på desktop.

---

## 4. Kodkvalitet och städning (P2)

### 4.1 Dubbletter och dött
- `app/admin/page.tsx` — ostylad äldre dashboard som bara listar feedback.
  Bör redirecta till `/admin/dashboard`.
- `app/admin/articles/[id]/edit/page.tsx` — äldre kopia av
  `app/admin/articles/[id]/page.tsx` med vanlig textarea. Död route.
- `components/client-article-content.tsx` — tom fil.
- `components/persistent-tooltip.tsx`, `components/ui/tooltip.tsx`,
  `ui/radio-group.tsx`, `ui/popover.tsx`, `ui/form.tsx`, `ui/alert.tsx` —
  importeras ingenstans.
- `app/fonts/GeistVF.woff`, `GeistMonoVF.woff` — rester från
  create-next-app, används inte.
- `feedback.log` — testskräp i repot.
- `variant="icon"` i `FeedbackButton` används inte längre.

### 4.2 Oanvända beroenden
`zod`, `@hookform/resolvers`, `react-hook-form` (bara i oanvända
`ui/form.tsx`), `next-seo`, `express-rate-limit`, `dompurify` +
`@types/dompurify` (bara `isomorphic-dompurify` används),
`@radix-ui/react-popover`, `@radix-ui/react-radio-group`,
`@radix-ui/react-tooltip`. Mindre bundle, färre audit-varningar.

### 4.3 Quill-CSS laddas för alla besökare
`app/globals.css` importerar `react-quill/dist/quill.snow.css` globalt —
~30 kB CSS för en editor bara admin ser. `quill-editor.tsx` importerar den
redan själv; ta bort raden i globals.

### 4.4 Två ESLint-konfigurationer som säger olika saker
`.eslintrc.js` (strikt: `no-explicit-any`, `no-unused-vars` som error) och
`.eslintrc.json` (Nexts standard). ESLint läser `.js`-filen. Dessutom lintar
`next lint` inte `hooks/` eller `middleware.ts` som standard —
`hooks/use-toast.ts` har två fel som aldrig syns.

### 4.5 Utfasat Supabase-paket
`@supabase/auth-helpers-nextjs` är ersatt av `@supabase/ssr`. Fungerar än,
men får inga uppdateringar och bör bytas i samband med Next-uppgraderingen.

### 4.6 `console.log` i produktion
~35 anrop i API-routes och komponenter, inklusive fullständigt
feedback-innehåll och artikeldata i serverloggen. Rensa eller byt till en
loggnivå.

### 4.7 Småsaker
- `<Link><Button>` i `article-list.tsx` ger `<a><button>` — ogiltig HTML.
  Använd `asChild`.
- `ArticleList key={Date.now()}` och en tom `useEffect` i dashboarden är
  omrenderingshack.
- `Authorization: Bearer` skickas från admin-editorn men API:t läser bara
  cookies — vilseledande.
- `env`-blocket i `next.config.mjs` är onödigt; `NEXT_PUBLIC_*` exponeras
  automatiskt.
- `formattedDate` i `feedback-list.tsx` klipper ISO-strängen manuellt → visar
  UTC-tid, inte svensk tid.
- `style={{ transformOrigin }}` på skotten i `target-plot.tsx` används inte.
- Slug valideras inte: mellanslag och åäö ger trasiga adresser, och
  dubbletter ger ett rått Supabase-fel.

---

## 5. Förbättringsförslag — verktyget (P3)

### 5.1 ✅ Export/import av profiler och logg — ÅTGÄRDAT
Panelen "Säkerhetskopiera" under loggen sparar allt till en JSON-fil och läser
in den igen. Importen slår ihop i stället för att skriva över, granskar varje
post och rapporterar vad som lades till, fanns redan respektive hoppades över.
Web Share API på mobilen, nedladdning på desktop. 34 kontroller i
`npm run test:backup`, och hela rundan (export → tömd lagring → import)
verifierad i webbläsaren.

### 5.2 Kontrollskott-flöde
Efter "Vrid 5 klick vänster" finns idag inget nästa steg. Föreslå: knappen
"Jag har vridit — lägg in kontrollskott" som nollställer tavlan, minns
justeringen och visar ackumulerat: "Totalt idag: 7 klick vänster, 3 upp". Då
blir loggen en riktig historik per pass i stället för lösa beräkningar.

### 5.3 Filtrera loggen per vapen
Med flera vapen blandas allt. Filtrera på aktiv profil och visa en liten
trend ("siktet har vandrat 2 klick höger sedan i våras").

### 5.4 Ladda tillbaka ett loggat pass
Tryck på en loggpost → skotten läggs tillbaka på tavlan. Bra för att jämföra
grupper mellan pass.

### 5.5 Foto på tavlan
Den stora idén: fota tavlan, markera två punkter med känt avstånd (t.ex. 10
cm på rutnätet) och tryck sedan på hålen. Appen räknar om pixlar till cm.
Slipper mäta med linjal helt. Kräver bildhantering i klienten men ingen
server.

### 5.6 Halva klick och avrundningsval
Vissa sikten har tydliga halvsteg. Visa det exakta värdet ("5,4 klick") och
låt användaren välja "hela klick" eller "halva klick" per profil.

### 5.7 Tum och yards
För MOA-sikten med engelsk manual. Enhetsväxel per profil.

### 5.8 Enkel ballistik
"Inskjuten 3 cm högt på 100 m — var träffar jag på 150 och 200 m?" Kräver
BC + utgångshastighet per profil och en G1/G7-modell. Stor men efterfrågad.

### 5.9 Generera egen måltavla
SVG → PDF i webbläsaren: välj rutnät, pappersstorlek och riktpunktens
storlek. Ersätter den enda statiska PDF:en.

### 5.10 Smått
- Haptisk feedback (`navigator.vibrate`) vid tryck på tavlan (Android).
- Dela resultatet som text/bild ("5 ← · 12 ↑ på 100 m").
- Avståndsknappar konfigurerbara per profil.
- Illustration av rattarna med vridriktning — många sikten har pilar märkta
  "U" och "R" som förvirrar.
- Piltangenter på tavlan (se 3.15).
- Analytics-händelser för "beräkning klar", "sparad i logg", "installerad".

---

## 6. Förbättringsförslag — sajten (P2–P3)

### 6.1 Delningsbild (og:image)
Ingen `og:image` någonstans → länken ser tråkig ut i Messenger/Facebook där
jaktfolk delar. `app/opengraph-image.tsx` genererar en automatiskt.

### 6.2 404- och felsidor i samma design (se 2.8)

### 6.3 Laddningsvy för `/artiklar`
Sidan är nu dynamisk (hämtar från Supabase per anrop) — `loading.tsx` ger en
skelett-vy i stället för blank sida.

### 6.4 Sanera HTML på servern
`ArticleContent` är en klientkomponent bara för att köra DOMPurify.
`isomorphic-dompurify` fungerar på servern → mindre JavaScript till
besökaren.

### 6.5 Engelsk version
Verktyget är språkoberoende i grunden; en `/en` med samma logik når en mycket
större publik. Kräver att alla strängar plockas ut.

### 6.6 Skip-länk och fokusordning
Inget "hoppa till innehåll", och mobilmenyn saknar fokusfälla. Låg kostnad.

---

## 7. Förbättringsförslag — admin (P2–P3)

- Hela admin är utanför den nya designen: engelska texter, hårdkodad
  `bg-gray-100`, ostylade listor.
- Ingen utloggningsknapp trots att `/api/admin/logout` finns.
- Ingen radering av artiklar.
- Ingen automatisk slug från titeln, ingen förhandsgranskning, ingen
  bilduppladdning.
- `react-quill` 2.0 använder `findDOMNode` och går sönder på React 19 — byt
  till Tiptap eller Lexical i samband med uppgradering.
- Feedback: ingen radering, ingen "hanterad"-markering, ingen sökning.
- Slå ihop `/admin`, `/admin/dashboard` och de två artikelsidorna till en
  route-grupp.

---

## Förslag på ordning

1. ~~Uppgradera Next, lås API-vägarna~~ — klart.
2. ~~Kontaktformuläret, 404-hantering, mörkt läge i artiklar, felsidor~~ — klart.
3. **Nu:** kör RLS-SQL:en i Supabase (1.6). Utan den är resten av
   säkerhetsarbetet halvt.
4. **Verktyget:** auto-zoom (3.1), tomt-läge (3.2), bekräfta radering (3.6),
   spara inställningar utan profil (3.7), komma i fält (3.4).
5. **Städa:** 4.1–4.7 i ett svep — ger renare `npm audit` och mindre bundle.
6. ~~Export/import (5.1)~~ — klart. Kvar av de stora nyttoförbättringarna är
   kontrollskott-flödet (5.2), som gör loggen till en riktig historik per pass.

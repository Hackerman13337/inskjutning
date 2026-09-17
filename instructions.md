# Inskjutning — projektöversikt

Verktyg som räknar om träffpunktens avvikelse till antal klick på kikarsiktets
höjd- och sidoratt. All beräkning sker i webbläsaren, utan backend.

## Kärnfunktioner

- **Interaktiv måltavla** (`components/target-plot.tsx`)
  SVG i centimeterkoordinater. Tryck lägger ett skott, dra flyttar det, zoomen
  går mellan ±5 och ±80 cm. Y-axeln vänds vid ritning (positivt = uppåt).
- **Ett skott eller skottgrupp**
  I gruppläge läggs upp till 10 skott in och justeringen räknas mot gruppens
  medelträffpunkt (MPI). Gruppstorleken visas i cm och MOA.
- **Klickvärden** (`lib/ballistics.ts`)
  1/8, 1/4, 1/3, 1/2 och 1 MOA, 0,05 och 0,1 MIL, cm-baserade sikten samt eget
  värde i cm per klick på 100 m.
- **Önskad träffpunkt**
  Justeringen behöver inte gå mot mitten — man kan be om t.ex. 3 cm högt.
- **Vapenprofiler och logg** (`lib/storage.ts`)
  Sparas i localStorage. Profilen håller klickvärde, standardavstånd och önskad
  träffpunkt, och uppdateras automatiskt när inställningarna ändras.
- **Säkerhetskopiering** (`lib/backup.ts`, `components/backup-panel.tsx`)
  Export och import av allt till en JSON-fil. Importen granskar varje post och
  slår ihop utan att skriva över befintlig data. Testas med
  `npm run test:backup`.

## Beräkning

Ett klick flyttar träffpunkten en fast vinkel:

```
cm per klick = klickvärde i cm på 100 m × (avstånd / 100)
antal klick  = (önskad träffpunkt − medelträffpunkt) / cm per klick
```

Positivt antal klick = höger respektive upp. 1 MOA = 2,908882 cm på 100 m,
1 MIL = 10 cm på 100 m. Restfelet efter avrundning till hela klick visas för
användaren.

## PWA

Sajten är installerbar på hemskärmen och fungerar utan täckning.
`app/manifest.ts` beskriver appen, `public/sw.js` sköter cachningen (sidor:
nätet först, byggfiler: cachen först, API/admin/andra domäner: aldrig cache) och
`components/install-prompt.tsx` visar installationstipset — knapp på Android,
instruktion om dela-knappen på iOS. Service workern registreras bara i
produktionsbygget. Reglerna testas med `npm run test:sw`.

## Måltavlor

Fyra utskrivbara A4-tavlor i `public/maltavlor/`, genererade av
`scripts/generate-targets.py` ovanpå den beroendefria PDF-skrivaren
`scripts/pdfkit.py`. Måtten måste vara exakta — man räknar rutor på papperet
och matar in centimeter i verktyget — så varje tavla har ett kontrollmått på
10 cm, och `npm run test:targets` mäter PDF:erna för att verifiera rutstorlek,
sidformat och att rutnäten går jämnt ut i kanterna.

`components/target-gallery.tsx` visar tavlorna med en storvisning. Layouten är
tvåspaltig på breda skärmar eftersom en stående A4 annars begränsas av
fönsterhöjden.

## Design

Mörkt fältläge som standard enligt systeminställning, med ljust läge. Färger
ligger som HSL-variabler i `app/globals.css`; måltavlan har egna tokens
(`--target-face`, `--target-line`, `--shot`, `--mpi`) så att den fungerar i båda
lägena. Mobilen är utgångspunkten — tavlan ska gå att träffa med fingret.

## Struktur

```
app/            Sidor (App Router). Startsidan innehåller verktyget.
components/     calculator, target-plot, adjustment-result, shot-log + ui/
lib/            ballistics.ts (ren beräkning), storage.ts (localStorage)
```

Artiklar, feedback och admin använder Supabase och kräver
`NEXT_PUBLIC_SUPABASE_URL` och `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Verktyget
självt fungerar utan dem.

## Teknik

Next.js 14 (App Router), TypeScript, Tailwind CSS, Radix UI/shadcn.

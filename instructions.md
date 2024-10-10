# Project Overview:
- Hemsidan är ett verktyg som hjälper skyttar att snabbt beräkna hur många klick de behöver justera sitt kikarsikte baserat på avståndet till målet och träffpunktens avvikelse från mitten. Verktyget är designat för att vara enkelt och direkt, utan backend eller avancerade integrationer, med allt som hanteras i frontend.

# Core Functionalities:
- Inskjutnings- och träffavståndsinmatning:

  -   Avstånd till målet (meter): Användaren matar in avståndet till målet i meter.
  -   Avvikelse från mitten (cm): Användaren anger hur mycket träffen avviker från mitten i centimeter, både horisontellt och vertikalt.
  -   Kikarsiktets justering (klick per cm eller MOA): Användaren kan välja vilken typ av justering de använder:
        -   1 cm per klick på 100 meter.
        -   MOA (t.ex. 0,7 cm per klick på 100 meter).
  -   Beräkningsknapp:

- När användaren har fyllt i sina värden, trycker de på "Beräkna" och får en omedelbar uträkning av hur många klick som krävs för att justera kikarsiktet.
- Resultatvisning:
  -   Antal klick för horisontell justering: Visar hur många klick användaren behöver justera siktet i sidled.
  -   Antal klick för vertikal justering: Visar hur många klick användaren behöver justera siktet i höjdled.
  -   Möjlighet att återställa formuläret för nya beräkningar.

-  Design:
  -   Minimalistisk design: Fokuserad på enkelhet, med ett rent gränssnitt som gör det lätt att mata in och få beräkningar snabbt.
  -   Färgskala: Neutral färgpalett med visuellt markerade knappar och resultat.
Responsiv design: Anpassad för att fungera lika bra på datorer som på mobila enheter.
  -   Inmatningsformulär: Centralt placerat, direkt synligt på startsidan för enkel användning.
  -   Beräkningsresultat: Visas direkt under inmatningsformuläret, utan att användaren behöver ladda om sidan.
  -   Användarflöde:

Steg 1: Användaren går till startsidan och ser en kort förklaring om hur verktyget fungerar.
Steg 2: Användaren fyller i avstånd till målet, träffens avvikelse från mitten, samt vilken typ av kikarsiktejustering som används.
Steg 3: Användaren trycker på "Beräkna".
Steg 4: Resultatet visas omedelbart, och användaren ser hur många klick de ska justera siktet i både höjd- och sidled.
Tekniska specifikationer:

Frontend: Sidan byggs med Next.js 14.2 för snabb interaktivitet och smidiga användarupplevelser.
CSS/Design: Tailwind CSS används för att skapa en enkel, responsiv och modern design.
Beräkningar: All logik och beräkningar hanteras direkt i frontend för omedelbar återkoppling utan behov av en backend.

# File structure
INSKJU
├── .next
├── app
│   ├── fonts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   └── ui
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── popover.tsx
│       ├── select.tsx
│       └── tooltip.tsx
├── lib
├── node_modules
├── .eslintrc.json
├── .gitignore
├── components.json
├── instructions.md
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
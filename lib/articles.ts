/**
 * Register över artiklarna som ligger som egna sidor i koden.
 *
 * Listan är källan för artikelöversikten, sitemapen och "läs vidare"-länkarna,
 * så en ny artikel behöver bara läggas till här och få en egen mapp under
 * app/artiklar/. Artiklar som skrivs i admin ligger i databasen och hanteras
 * separat.
 */

export interface ArticleMeta {
  slug: string
  /** Rubrik på sidan och i listan. */
  title: string
  /** Sidtitel om den ska skilja sig från rubriken — annars används title. */
  metaTitle?: string
  /** Metabeskrivning för sökresultatet. Håll den under ungefär 160 tecken. */
  description: string
  /** Ingressen i artikellistan. */
  excerpt: string
  /** ISO-datum. Saknas det visas inget datum. */
  published?: string
  updated?: string
  readingMinutes: number
  /** Används för att föreslå relaterade artiklar. */
  topics: string[]
}

export const articles: ArticleMeta[] = [
  {
    slug: 'skjuta-in-kikarsikte',
    title: 'Skjuta in kikarsiktet — steg för steg',
    metaTitle: 'Skjuta in kikarsikte — komplett guide steg för steg',
    description:
      'Så skjuter du in kikarsiktet: förberedelser, första skottet, hur du räknar ut antalet klick och hur du kontrollerar att det sitter. Med räknare och måltavlor.',
    excerpt:
      'Hela gången från monterat sikte till bekräftad nolla — utan att bränna en ask ammunition på gissningar.',
    published: '2026-09-17',
    readingMinutes: 9,
    topics: ['grunderna', 'inskjutning'],
  },
  {
    slug: 'utanfor-tavlan',
    title: 'Träffar inte tavlan alls — så hittar du tillbaka',
    metaTitle: 'Träffar inte måltavlan vid inskjutning — så gör du',
    description:
      'Inget hål i pappret och ingen aning om åt vilket håll du ska vrida? Fem sätt att komma in på tavlan igen utan att bränna en ask ammunition.',
    excerpt:
      'Inget hål i pappret, ingen aning åt vilket håll. Så kommer du in på tavlan igen.',
    published: '2026-09-17',
    readingMinutes: 8,
    topics: ['grunderna', 'inskjutning', 'felsökning'],
  },
  {
    slug: 'moa-och-mil',
    title: 'MOA eller MIL? Klickvärdet på siktet förklarat',
    metaTitle: 'MOA eller MIL — klickvärde på kikarsikte förklarat',
    description:
      'Vad betyder 1/4 MOA och 0,1 MIL? Så räknar du om klick till centimeter på 50, 100 och 200 meter, och så hittar du ditt siktes klickvärde.',
    excerpt:
      'Varför ett klick flyttar olika många centimeter beroende på avstånd — och tabellerna du behöver.',
    published: '2026-09-17',
    readingMinutes: 7,
    topics: ['grunderna', 'klickvärde'],
  },
  {
    slug: 'lasa-traffbilden',
    title: 'Läs träffbilden: medelträffpunkt och spridning',
    metaTitle: 'Läsa träffbilden — medelträffpunkt, spridning och gruppering',
    description:
      'Ett skott kan ljuga. Så tolkar du en skottgrupp: medelträffpunkt, spridning i cm och MOA, och vad träffbilden säger om vapen, ammunition och skytt.',
    excerpt:
      'Skillnaden mellan att sikta fel och att skjuta spritt — och varför du ska justera mot gruppens mitt.',
    published: '2026-09-17',
    readingMinutes: 7,
    topics: ['träffbild', 'inskjutning'],
  },
  {
    slug: 'skjuta-in-pa-50-meter',
    title: 'Skjuta in på 50 meter när du vill träffa på 100',
    metaTitle: 'Skjuta in på 50 meter för nolla på 100 meter',
    description:
      'Kort bana men längre skjutavstånd i skogen? Så fungerar inskjutning på 50 meter, varför kulan skär siktlinjen två gånger och vad du behöver kontrollera.',
    excerpt:
      'Korta banan duger längre än många tror — men inte genom att bara halvera avvikelsen.',
    published: '2026-09-17',
    readingMinutes: 6,
    topics: ['avstånd', 'inskjutning'],
  },
  {
    slug: 'kontrollera-infor-jakten',
    title: 'Kontrollera inskjutningen före jakten',
    metaTitle: 'Kontrollskjutning före jakten — checklista',
    description:
      'Siktet vandrar av stötar, temperatur och byte av ammunition. Så kontrollerar du inskjutningen inför jaktsäsongen med några få skott.',
    excerpt:
      'Vad som får ett inskjutet vapen att hamna fel, och hur du upptäcker det innan det räknas.',
    published: '2026-09-17',
    readingMinutes: 6,
    topics: ['jakt', 'inskjutning'],
  },
  {
    slug: 'zeiss-sikte',
    title: 'Ställa in ett Zeiss-sikte',
    metaTitle: 'Skjuta in Zeiss kikarsikte — klickvärde och ballistisk ratt',
    description:
      'Så hittar du klickvärdet på ditt Zeiss-sikte, så fungerar den ballistiska ASV-ratten, och så nollställer du rattarna efter inskjutningen.',
    excerpt: 'Klickvärde, ballistisk ratt och nollställning på Zeiss jaktsikten.',
    published: '2026-09-17',
    readingMinutes: 5,
    topics: ['märken', 'klickvärde'],
  },
  {
    slug: 'swarovski-sikte',
    title: 'Ställa in ett Swarovski-sikte',
    metaTitle: 'Skjuta in Swarovski kikarsikte — klickvärde och ballistisk ratt',
    description:
      'Klickvärdet på Swarovski-sikten, hur den ballistiska ratten påverkar inskjutningen och hur du nollställer efteråt.',
    excerpt: 'Klickvärde, ballistisk ratt och nollställning på Swarovski jaktsikten.',
    published: '2026-09-17',
    readingMinutes: 5,
    topics: ['märken', 'klickvärde'],
  },
  {
    slug: 'leupold-sikte',
    title: 'Ställa in ett Leupold-sikte',
    metaTitle: 'Skjuta in Leupold kikarsikte — MOA-klick och CDS-ratt',
    description:
      'Leupold räknar oftast i MOA. Så hittar du klickvärdet, så fungerar CDS-ratten och så nollställer du rattarna efter inskjutningen.',
    excerpt: 'MOA-klick, CDS-ratten och nollställning på Leupold-sikten.',
    published: '2026-09-17',
    readingMinutes: 5,
    topics: ['märken', 'klickvärde'],
  },
  {
    slug: 'hawke',
    title: 'Hur man ställer in ett Hawke-sikte',
    description:
      'Lär dig hur du enkelt ställer in ditt Hawke-sikte med hjälp av vårt inskjutningsverktyg och specialdesignade måltavlor.',
    excerpt: 'En kort guide för dig med ett Hawke-sikte på bössan.',
    readingMinutes: 3,
    topics: ['märken', 'inskjutning'],
  },
]

export function getArticle(slug: string): ArticleMeta | undefined {
  return articles.find((article) => article.slug === slug)
}

/**
 * Artiklar att läsa vidare. Först de som delar ämne med den man läser, sedan
 * övriga, så att listan alltid blir full även för en artikel som står ensam
 * om sitt ämne.
 */
export function relatedArticles(slug: string, count = 3): ArticleMeta[] {
  const current = getArticle(slug)
  const others = articles.filter((article) => article.slug !== slug)

  if (!current) return others.slice(0, count)

  const shared = (article: ArticleMeta) =>
    article.topics.filter((topic) => current.topics.includes(topic)).length

  return [...others].sort((a, b) => shared(b) - shared(a)).slice(0, count)
}

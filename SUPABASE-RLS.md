# Supabase: radnivåskydd (RLS)

**Det här är det viktigaste steget kvar, och det kan bara göras i Supabase —
inte i koden.**

## Varför

`NEXT_PUBLIC_SUPABASE_ANON_KEY` skickas med till varje besökare. Den ligger i
klartext i JavaScript-paketet på inskjutning.se och går att kopiera på tio
sekunder. Vem som helst kan alltså prata direkt med din databas med den
nyckeln, helt utan att gå via sajtens API-vägar.

Inloggningskontrollerna jag lagt in i `/api/feedback` och `/api/articles`
stoppar den som knackar på ytterdörren. Men om RLS släpper igenom anonyma
anrop står köksdörren fortfarande öppen. **Båda behövs.**

## Steg 1 — se hur det ser ut idag

Kör i Supabase → SQL Editor:

```sql
-- Är radnivåskyddet påslaget?
select relname as tabell, relrowsecurity as rls_på
from pg_class
where relname in ('feedback', 'articles');

-- Vilka policyer finns?
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, cmd;
```

Är `rls_på` false för någon tabell ligger den **helt öppen** — vem som helst
kan läsa, ändra och radera allt i den.

## Steg 2 — sätt rätt regler

Kör hela blocket. Det är skrivet för att kunna köras om utan att något går
sönder.

```sql
alter table public.feedback enable row level security;
alter table public.articles enable row level security;

-- Rensa bort tidigare regler så att inget gammalt ligger kvar och släpper igenom
drop policy if exists "feedback_insert_alla"      on public.feedback;
drop policy if exists "feedback_select_inloggad"  on public.feedback;
drop policy if exists "articles_select_alla"      on public.articles;
drop policy if exists "articles_insert_inloggad"  on public.articles;
drop policy if exists "articles_update_inloggad"  on public.articles;
drop policy if exists "articles_delete_inloggad"  on public.articles;

-- FEEDBACK och kontaktmeddelanden
-- Alla får skicka in, men bara inloggade får läsa. Texterna innehåller ofta
-- namn och e-postadresser som folk skrivit i förtroende.
create policy "feedback_insert_alla"
  on public.feedback for insert
  to anon, authenticated
  with check (true);

create policy "feedback_select_inloggad"
  on public.feedback for select
  to authenticated
  using (true);

-- Ingen policy för update/delete = ingen kan ändra eller radera feedback.
-- Lägg till en för authenticated om du vill kunna rensa från admin.

-- ARTIKLAR
-- Alla får läsa (de är publika), bara inloggade får skriva.
create policy "articles_select_alla"
  on public.articles for select
  to anon, authenticated
  using (true);

create policy "articles_insert_inloggad"
  on public.articles for insert
  to authenticated
  with check (true);

create policy "articles_update_inloggad"
  on public.articles for update
  to authenticated
  using (true)
  with check (true);

create policy "articles_delete_inloggad"
  on public.articles for delete
  to authenticated
  using (true);
```

## Steg 3 — kontrollera att det tog

Hämta din anon-nyckel (Supabase → Settings → API) och kör i terminalen:

```bash
curl "https://DITT-PROJEKT.supabase.co/rest/v1/feedback?select=*" \
  -H "apikey: DIN_ANON_NYCKEL"
```

Rätt svar är en tom lista `[]` eller ett behörighetsfel. **Får du tillbaka
feedbacktexter är läckan kvar** — då har någon policy inte tagit, kör steg 1
igen och se vad som ligger kvar.

Testa samma sak mot artiklarna:

```bash
# Ska fungera (artiklar är publika):
curl "https://DITT-PROJEKT.supabase.co/rest/v1/articles?select=title" \
  -H "apikey: DIN_ANON_NYCKEL"

# Ska INTE fungera:
curl -X PATCH "https://DITT-PROJEKT.supabase.co/rest/v1/articles?id=eq.1" \
  -H "apikey: DIN_ANON_NYCKEL" \
  -H "Content-Type: application/json" \
  -d '{"title":"kapad"}'
```

## Kontrollera sedan att sajten fortfarande fungerar

- `/artiklar` listar artiklarna → anon select på `articles` fungerar
- Feedback-rutan går att skicka → anon insert på `feedback` fungerar
- `/kontakt` går att skicka → samma tabell
- Inloggad i `/admin/dashboard` → feedbacklistan visas
- Utloggad på `/api/feedback` → `401`

Går något av det första fel är en policy för hård; går det sista fel är någon
för mjuk.

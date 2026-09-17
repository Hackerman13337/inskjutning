import Link from 'next/link'

const links = [
  { name: 'Verktyget', href: '/' },
  { name: 'Måltavlor', href: '/maltavlor' },
  { name: 'Artiklar', href: '/artiklar' },
]

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Inskjutning</p>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">
            Ett fritt verktyg för att skjuta in kikarsiktet. Beräkningarna är hjälpmedel — kontrollera
            alltid med ett skott innan jakt.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

import { Button } from './ui/button'
import { ThemeToggle } from './theme-toggle'
import { cn } from '@/lib/utils'

const menuItems = [
  { name: 'Verktyget', href: '/' },
  { name: 'Måltavlor', href: '/maltavlor' },
  { name: 'Artiklar', href: '/artiklar' },
]

function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-8 w-8', className)}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="21" className="stroke-foreground/25" strokeWidth="2" />
      <circle cx="24" cy="24" r="13" className="stroke-foreground/40" strokeWidth="2" />
      <circle cx="24" cy="24" r="4.5" className="fill-primary" />
      <path d="M24 1v10M24 37v10M1 24h10M37 24h10" className="stroke-foreground/60" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const closeMenu = () => setIsMenuOpen(false)

  // Stäng menyn när man navigerar och lås sidan bakom den öppna menyn.
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <header
      className="sticky top-0 z-50 border-b border-border/70 bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5" onClick={closeMenu}>
          <Logo />
          <span className="text-base font-semibold tracking-tight">Inskjutning</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {menuItems.map((item) => {
            const isActive =
              item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                )}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? 'Stäng meny' : 'Öppna meny'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobilmeny */}
      <div
        className={cn(
          'fixed inset-x-0 top-[calc(4rem+env(safe-area-inset-top))] z-40 border-b border-border bg-background transition-all duration-200 md:hidden',
          isMenuOpen ? 'visible opacity-100' : 'invisible -translate-y-2 opacity-0'
        )}
      >
        <nav className="mx-auto max-w-6xl px-4 py-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      'block rounded-lg px-3 py-3 text-base font-medium transition-colors',
                      isActive ? 'bg-accent text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}

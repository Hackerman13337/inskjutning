'use client'

import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { THEME_STORAGE_KEY as STORAGE_KEY } from '@/lib/theme-script'

type Theme = 'light' | 'dark'

function systemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null
    setTheme(stored ?? systemTheme())
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* Privat läge kan blockera lagring — temat gäller ändå för den här sessionen. */
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Byt till ljust läge' : 'Byt till mörkt fältläge'}
      className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
    >
      <Sun className="h-[1.15rem] w-[1.15rem] rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.15rem] w-[1.15rem] rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

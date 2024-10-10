'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <div className="w-1/4">
            <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="23" stroke="black" strokeWidth="2"/>
              <circle cx="25" cy="25" r="5" fill="black"/>
              <line x1="2" y1="25" x2="48" y2="25" stroke="black" strokeWidth="2"/>
              <line x1="25" y1="2" x2="25" y2="48" stroke="black" strokeWidth="2"/>
            </svg>
          </div>
          <nav className="hidden md:block w-1/2">
            <ul className="flex justify-center space-x-6">
              <li><Link href="/" className="text-gray-700 hover:text-gray-900">Inskjutningsverktyg</Link></li>
              <li><Link href="/maltavlor" className="text-gray-700 hover:text-gray-900">Måltavlor</Link></li>
              <li><Link href="/kontakt" className="text-gray-700 hover:text-gray-900">Kontakt</Link></li>
            </ul>
          </nav>
          <div className="w-1/4 flex justify-end">
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu />
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden py-2">
            <ul className="space-y-2">
              <li><Link href="/" className="block text-gray-700 hover:text-gray-900">Inskjutningsverktyg</Link></li>
              <li><Link href="/maltavlor" className="block text-gray-700 hover:text-gray-900">Måltavlor</Link></li>
              <li><Link href="/kontakt" className="block text-gray-700 hover:text-gray-900">Kontakt</Link></li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
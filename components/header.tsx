'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FeedbackButton } from './feedback-button'
import { Button } from './ui/button'
import { Menu, X } from 'lucide-react'

// Justera detta värde för att flytta logotypen på stora skärmar (använd positiva värden för att flytta åt höger)
const LOGO_LEFT_POSITION = '600px'  // t.ex. '0px', '20px', '40px', etc.

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const menuItems = [
    { name: 'Inskjutningsverktyg', href: '/' },
    { name: 'Måltavlor', href: '/maltavlor' },
    { name: 'Kontakt', component: <FeedbackButton variant="menu-item" title="Kontakta oss" /> }
  ]

  const Logo = () => (
    <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="23" stroke="black" strokeWidth="2"></circle>
      <circle cx="25" cy="25" r="5" fill="black"></circle>
      <line x1="2" y1="25" x2="48" y2="25" stroke="black" strokeWidth="2"></line>
      <line x1="25" y1="2" x2="25" y2="48" stroke="black" strokeWidth="2"></line>
    </svg>
  )

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4 lg:justify-center">
          {/* Logo */}
          <div className="flex-shrink-0 lg:absolute" style={{ left: LOGO_LEFT_POSITION }}>
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center flex-grow">
            {/* Desktop menu */}
            <nav className="flex space-x-8 items-center">
              {menuItems.map((item) => (
                <div key={item.name} className="flex items-center">
                  {item.component ? (
                    <div className="text-gray-600 hover:text-gray-900 cursor-pointer">
                      {item.component}
                    </div>
                  ) : (
                    <Link 
                      href={item.href!} 
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Feedback button */}
            <div className="ml-4">
              <FeedbackButton variant="icon" />
            </div>
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      
      {/* Fullscreen mobile menu */}
      <div className={`fixed inset-0 bg-white z-50 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} md:hidden`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" onClick={closeMenu}>
              <Logo />
            </Link>
            <Button variant="ghost" onClick={closeMenu}>
              <X />
            </Button>
          </div>
          <nav>
            <ul className="space-y-6">
              {menuItems.map((item, index) => (
                <li key={item.name} className={`transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{transitionDelay: `${index * 100}ms`}}>
                  {item.component ? (
                    <div onClick={closeMenu} className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                      {item.component}
                    </div>
                  ) : (
                    <Link 
                      href={item.href!} 
                      className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors" 
                      onClick={closeMenu}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

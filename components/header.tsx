'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { FeedbackButton } from './feedback-button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  const menuItems = [
    { name: 'Inskjutningsverktyg', href: '/' },
    { name: 'Måltavlor', href: '/maltavlor' },
    { name: 'Kontakt', href: '/kontakt' }
  ]

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4 max-w-[800px]">
        <div className="flex items-center justify-between py-2">
          <div className="w-1/4 md:w-[100px] relative z-50 flex justify-start">
            <Link href="/">
              <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="23" stroke="black" strokeWidth="2"/>
                <circle cx="25" cy="25" r="5" fill="black"/>
                <line x1="2" y1="25" x2="48" y2="25" stroke="black" strokeWidth="2"/>
                <line x1="25" y1="2" x2="25" y2="48" stroke="black" strokeWidth="2"/>
              </svg>
            </Link>
          </div>
          <nav className="hidden md:flex justify-center flex-grow">
            <div className="flex justify-center space-x-8">
              {menuItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className="text-gray-600 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
          <div className="w-1/4 md:w-[100px] flex justify-end">
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 z-50 relative"
                aria-label={isMenuOpen ? "Stäng meny" : "Öppna meny"}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fullskärms mobilmeny */}
      <div className={`fixed inset-0 bg-white transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} md:hidden`}>
        <div className={`flex flex-col h-full justify-between pt-20 pb-8 transition-all duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-8'}`}>
          <nav className="container mx-auto px-4">
            <ul className="space-y-6">
              {menuItems.map((item, index) => (
                <li key={item.name} className={`transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{transitionDelay: `${index * 100}ms`}}>
                  <Link 
                    href={item.href} 
                    className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors" 
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="container mx-auto px-4 mt-auto">
            <div className={`transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{transitionDelay: `${menuItems.length * 100}ms`}}>
              <FeedbackButton variant="menu-item" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

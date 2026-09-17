'use client'

import { useEffect } from 'react'

/**
 * Registrerar service workern som gör appen användbar utan täckning.
 * Bara i produktion — i utvecklingsläge skulle cachen ligga i vägen för
 * hot reload.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Registreringen kan blockeras (privat läge, avstängt i webbläsaren).
        // Sidan fungerar ändå, bara utan offline-stöd.
      })
    }

    if (document.readyState === 'complete') {
      register()
      return
    }

    window.addEventListener('load', register)
    return () => window.removeEventListener('load', register)
  }, [])

  return null
}

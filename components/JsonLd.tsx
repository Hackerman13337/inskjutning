'use client'

import { useEffect } from 'react'

interface JsonLdData {
  '@context': string
  '@type': string
  [key: string]: string | number | boolean | object | null
}

interface JsonLdProps {
  data: JsonLdData
}

export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(data)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [data])

  return null
}

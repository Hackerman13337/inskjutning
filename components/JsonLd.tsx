interface JsonLdData {
  '@context': string
  '@type': string
  [key: string]: string | number | boolean | object | null
}

interface JsonLdProps {
  data: JsonLdData
}

/**
 * Skriver ut strukturerad data direkt i HTML:en. Tidigare lades taggen in med
 * useEffect efter att sidan renderats, vilket innebar att sökmotorer som inte
 * kör JavaScript aldrig såg den.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

import DOMPurify from 'isomorphic-dompurify'

interface ArticleContentProps {
  content: string
}

/**
 * Renderar artikelinnehåll från databasen.
 *
 * Saneringen körs på servern — isomorphic-dompurify fungerar i båda miljöerna,
 * så komponenten behöver inte vara en klientkomponent. Det sparar JavaScript
 * hos besökaren.
 */
export function ArticleContent({ content }: ArticleContentProps) {
  const sanitizedContent = DOMPurify.sanitize(content ?? '')

  return (
    <div
      className="prose prose-sm max-w-none dark:prose-invert sm:prose-base prose-headings:tracking-tight prose-a:text-primary"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  )
}

'use client'

import React from 'react'
import DOMPurify from 'isomorphic-dompurify'

interface ArticleContentProps {
  content: string
}

export function ArticleContent({ content }: ArticleContentProps) {
  const sanitizedContent = DOMPurify.sanitize(content)

  return (
    <div 
      className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
    />
  )
}


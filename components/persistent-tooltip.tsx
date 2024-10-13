'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface PersistentTooltipProps {
  children: React.ReactNode
  content: string
}

export function PersistentTooltip({ children, content }: PersistentTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartRef = useRef<number | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 300)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.timeStamp
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current && e.timeStamp - touchStartRef.current < 200) {
      // This is a tap, not a long press or scroll
      e.preventDefault()
      setIsOpen(!isOpen)
    }
    touchStartRef.current = null
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <Tooltip open={isOpen}>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 p-0"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}

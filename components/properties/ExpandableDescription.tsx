'use client'

import { useState, useId } from 'react'

interface ExpandableDescriptionProps {
  text: string
  previewLength?: number
}

export function ExpandableDescription({ text, previewLength = 600 }: ExpandableDescriptionProps) {
  const [expanded, setExpanded] = useState(false)
  const isLong = text.length > previewLength
  const contentId = useId()

  return (
    <div>
      <div id={contentId}>
        <p
          className={`text-gray-600 leading-relaxed whitespace-pre-line text-sm ${
            isLong && !expanded ? 'line-clamp-[10]' : ''
          }`}
        >
          {text}
        </p>
      </div>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls={contentId}
          className="mt-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {expanded ? 'Weniger anzeigen' : 'Mehr anzeigen'}
        </button>
      )}
    </div>
  )
}

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps {
  className?: string
  padding?: boolean
  children: ReactNode
}

export function Card({ className, padding = true, children }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-gray-100 shadow-sm',
        padding && 'p-6',
        className,
      )}
    >
      {children}
    </div>
  )
}

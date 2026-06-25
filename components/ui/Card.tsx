import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps {
  className?: string
  padding?: boolean
  hover?: boolean
  children: ReactNode
}

export function Card({ className, padding = true, hover = false, children }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-gray-100/80 shadow-sm',
        hover && 'hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5 transition-all duration-300',
        padding && 'p-6',
        className,
      )}
    >
      {children}
    </div>
  )
}

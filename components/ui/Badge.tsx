import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const variantStyles = {
  default: 'bg-gray-100 text-gray-600 ring-gray-200/50',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200/50',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200/50',
  error: 'bg-red-50 text-red-700 ring-red-200/50',
  info: 'bg-blue-50 text-blue-700 ring-blue-200/50',
  primary: 'bg-primary/10 text-primary ring-primary/20',
}

export interface BadgeProps {
  variant?: keyof typeof variantStyles
  className?: string
  children: ReactNode
}

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ring-1 ring-inset',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  badge: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
}

export function StatCard({ label, value, badge, icon: Icon, iconColor, iconBg }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', iconBg, iconColor)}>
          {badge}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-secondary leading-none mb-1" suppressHydrationWarning>{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

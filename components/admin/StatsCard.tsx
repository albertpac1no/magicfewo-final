import type { LucideIcon } from 'lucide-react'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: number
  changeLabel?: string
}

export function StatsCard({ title, value, icon: Icon, change, changeLabel }: StatsCardProps) {
  const isPositive = (change ?? 0) >= 0

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {change !== undefined && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm flex items-center gap-1">
            {isPositive ? (
              <ArrowUp className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5 text-red-600" />
            )}
            <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-gray-500">{changeLabel}</span>
          </div>
        </div>
      )}
    </div>
  )
}

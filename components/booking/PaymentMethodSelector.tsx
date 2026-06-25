'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Building2, Wallet, Info, AlertTriangle, Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createSupabaseClient } from '@/lib/supabase/client'

type PaymentMethod = 'bank-transfer' | 'credit-card' | 'paypal'

interface PaymentMethodSelectorProps {
  userId: string
  selected: PaymentMethod | null
  onSelect: (method: PaymentMethod) => void
}

const methods = [
  {
    id: 'bank-transfer' as const,
    nameKey: 'payment.bankTransfer',
    icon: Building2,
    descKey: 'payment.bankTransferDesc',
    infoKey: 'payment.bankTransferInfo',
    requiresHistory: false,
    badges: [
      { label: 'SEPA', color: 'bg-secondary text-white' },
      { label: 'IBAN', color: 'bg-gray-200 text-gray-700' },
    ],
  },
  {
    id: 'credit-card' as const,
    nameKey: 'payment.creditCard',
    icon: CreditCard,
    descKey: 'payment.creditCardDesc',
    infoKey: 'payment.creditCardInfo',
    requiresHistory: true,
    badges: [
      { label: 'VISA', color: 'bg-blue-700 text-white' },
      { label: 'MC', color: 'bg-red-600 text-white' },
      { label: 'AMEX', color: 'bg-blue-500 text-white' },
    ],
  },
  {
    id: 'paypal' as const,
    nameKey: 'payment.paypal',
    icon: Wallet,
    descKey: 'payment.paypalDesc',
    infoKey: 'payment.paypalInfo',
    requiresHistory: true,
    badges: [
      { label: 'PayPal', color: 'bg-[#003087] text-white' },
    ],
  },
]

export function PaymentMethodSelector({ userId, selected, onSelect }: PaymentMethodSelectorProps) {
  const t = useTranslations('booking')
  const [hasHistory, setHasHistory] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function check() {
      try {
        const supabase = createSupabaseClient()
        const { data } = await supabase
          .from('bookings')
          .select('id')
          .eq('user_id', userId)
          .eq('status', 'completed')
          .limit(1)

        setHasHistory(!!data && data.length > 0)
      } catch {
        // fail silently — bank transfer remains available
      } finally {
        setLoading(false)
      }
    }
    check()
  }, [userId])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!hasHistory && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            {t('payment.firstBookingWarning')}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {methods.map((method) => {
          const isLocked = method.requiresHistory && !hasHistory
          const isSelected = selected === method.id
          const Icon = method.icon

          return (
            <button
              key={method.id}
              type="button"
              disabled={isLocked}
              onClick={() => onSelect(method.id)}
              className={`relative w-full text-left rounded-xl border-2 p-4 transition-all ${
                isLocked
                  ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                  : isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isLocked
                      ? 'bg-gray-100'
                      : isSelected
                        ? 'bg-primary/10'
                        : 'bg-gray-100'
                  }`}
                >
                  {isLocked ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`font-medium ${
                          isLocked ? 'text-gray-400' : isSelected ? 'text-primary' : 'text-gray-900'
                        }`}
                      >
                        {t(method.nameKey)}
                      </h3>
                      <div className="flex items-center gap-1">
                        {method.badges.map((badge) => (
                          <span
                            key={badge.label}
                            className={`${badge.color} text-[10px] font-bold px-1.5 py-0.5 rounded`}
                          >
                            {badge.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Radio dot */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isLocked
                          ? 'border-gray-300 bg-gray-100'
                          : isSelected
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                      }`}
                    >
                      {isSelected && !isLocked && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>

                  <p className={`text-xs mt-1 ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isLocked
                      ? t('payment.lockedMethod')
                      : t(method.descKey)}
                  </p>

                  {isSelected && !isLocked && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-start gap-2">
                      <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600">{t(method.infoKey)}</p>
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

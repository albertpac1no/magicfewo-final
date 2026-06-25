'use client'

import { useTranslations } from 'next-intl'
import { formatPrice } from '@/lib/utils'

interface PriceBreakdownProps {
  pricePerNight: number
  nights: number
  cleaningFee: number
  serviceFee: number
  isSpecialOffer: boolean
  specialOfferPrice: number | null
}

export function PriceBreakdown({
  pricePerNight,
  nights,
  cleaningFee,
  serviceFee,
  isSpecialOffer,
  specialOfferPrice,
}: PriceBreakdownProps) {
  const t = useTranslations('properties')
  const effectivePrice =
    isSpecialOffer && specialOfferPrice ? specialOfferPrice : pricePerNight
  const accommodationTotal = effectivePrice * nights
  const total = accommodationTotal + cleaningFee + serviceFee

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>
          {formatPrice(effectivePrice)} × {nights} {nights === 1 ? t('night') : t('nights')}
        </span>
        <span>{formatPrice(accommodationTotal)}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>{t('cleaningFee')}</span>
        <span>{formatPrice(cleaningFee)}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>{t('serviceFee')}</span>
        <span>{formatPrice(serviceFee)}</span>
      </div>
      <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-secondary">
        <span>{t('total')}</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  )
}

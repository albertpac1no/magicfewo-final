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
  const effectivePrice =
    isSpecialOffer && specialOfferPrice ? specialOfferPrice : pricePerNight
  const accommodationTotal = effectivePrice * nights
  const total = accommodationTotal + cleaningFee + serviceFee

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>
          {formatPrice(effectivePrice)} × {nights} {nights === 1 ? 'Nacht' : 'Nächte'}
        </span>
        <span>{formatPrice(accommodationTotal)}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Reinigungsgebühr</span>
        <span>{formatPrice(cleaningFee)}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Servicegebühr</span>
        <span>{formatPrice(serviceFee)}</span>
      </div>
      <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-secondary">
        <span>Gesamt</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Shield, CheckCircle, ChevronRight, Minus, Plus } from 'lucide-react'
import { PriceBreakdown } from './PriceBreakdown'
import type { Property } from '@/lib/types'

interface BookingCardProps {
  property: Property
  cleaningFee: number
  serviceFee: number
  freeCancellationHours: number
}

export function BookingCard({
  property,
  cleaningFee,
  serviceFee,
  freeCancellationHours,
}: BookingCardProps) {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [mobileExpanded, setMobileExpanded] = useState(false)

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)))
  }, [checkIn, checkOut])

  const effectivePrice =
    property.is_special_offer && property.special_offer_price
      ? property.special_offer_price
      : property.price_per_night

  const handleBook = () => {
    const total = effectivePrice * nights + cleaningFee + serviceFee
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: String(guests),
      nights: String(nights),
      total: String(total),
    })
    router.push(`/properties/${property.id}/book?${params.toString()}`)
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const canBook = checkIn && checkOut && nights > 0

  const bookingContent = (
    <>
      {/* Price Header */}
      <div className="mb-5">
        {property.is_special_offer && property.special_offer_price ? (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              {property.special_offer_price} €
            </span>
            <span className="text-gray-400 line-through text-sm">
              {property.price_per_night} €
            </span>
            <span className="text-gray-500 text-sm">/ Nacht</span>
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-secondary">
              {property.price_per_night} €
            </span>
            <span className="text-gray-500 text-sm">/ Nacht</span>
          </div>
        )}
        {property.review_overall_rating != null && (
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-secondary">
              {property.review_overall_rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Date + Guest Inputs */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-2 divide-x divide-gray-200">
          <div className="p-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
              Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value)
                if (checkOut && new Date(e.target.value) > new Date(checkOut)) {
                  setCheckOut('')
                }
              }}
              min={todayStr}
              className="w-full text-sm focus:outline-none bg-transparent text-gray-700"
            />
          </div>
          <div className="p-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
              Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || todayStr}
              disabled={!checkIn}
              className="w-full text-sm focus:outline-none bg-transparent text-gray-700 disabled:text-gray-400"
            />
          </div>
        </div>
        <div className="border-t border-gray-200 p-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
            Gäste
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-500 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-medium text-gray-700 w-16 text-center">
              {guests} {guests === 1 ? 'Gast' : 'Gäste'}
            </span>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(property.max_guests, g + 1))}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-500 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      {nights > 0 && (
        <div className="mb-4">
          <PriceBreakdown
            pricePerNight={property.price_per_night}
            nights={nights}
            cleaningFee={cleaningFee}
            serviceFee={serviceFee}
            isSpecialOffer={property.is_special_offer}
            specialOfferPrice={property.special_offer_price}
          />
        </div>
      )}

      <button
        onClick={handleBook}
        disabled={!canBook}
        className={`w-full py-3 rounded-full font-semibold transition-all text-sm ${
          canBook
            ? 'bg-primary text-white hover:opacity-90 shadow-md hover:shadow-lg'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {canBook ? 'Jetzt buchen' : 'Daten auswählen'}
      </button>

      <p className="text-center text-xs text-gray-400 mt-3">
        Keine Abbuchung bis zur Bestätigung
      </p>

      {/* Trust Badges */}
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Kostenlose Stornierung bis {freeCancellationHours}h vor Check-in</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
          <span>Sichere &amp; verschlüsselte Zahlung</span>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <div className="hidden lg:block">
        <div className="card p-6 sticky top-8">{bookingContent}</div>
      </div>

      {/* Mobile: fixed bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        {mobileExpanded ? (
          <div className="p-4 max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setMobileExpanded(false)}
              className="mb-3 text-sm text-gray-500 hover:text-gray-700"
            >
              ← Schließen
            </button>
            {bookingContent}
          </div>
        ) : (
          <div className="flex items-center justify-between p-4">
            <div>
              <span className="text-sm text-gray-500">Ab </span>
              <span className="text-lg font-bold text-secondary">{effectivePrice} €</span>
              <span className="text-sm text-gray-500"> / Nacht</span>
            </div>
            <button
              onClick={() => setMobileExpanded(true)}
              className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-1"
            >
              Jetzt buchen
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

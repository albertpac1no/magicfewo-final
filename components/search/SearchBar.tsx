'use client'

import { useState, useCallback } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { MapPin, Search, Minus, Plus, Users, BedDouble, Euro } from 'lucide-react'

function FieldLabel({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.08em]">
      <Icon className="w-3.5 h-3.5 text-primary" />
      {children}
    </span>
  )
}

function Stepper({
  label,
  value,
  display,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string
  value: number
  display: string
  min: number
  max: number
  step?: number
  onChange: (next: number) => void
}) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        aria-label={`${label} −`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - step))}
        className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="text-base font-bold text-secondary min-w-[4rem] text-center tabular-nums whitespace-nowrap">
        {display}
      </span>
      <button
        type="button"
        aria-label={`${label} +`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + step))}
        className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export function SearchBar() {
  const t = useTranslations('properties')
  const router = useRouter()

  const [location, setLocation] = useState('')
  const [guests, setGuests] = useState(2)
  const [bedrooms, setBedrooms] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const params = new URLSearchParams()
      if (location.trim()) params.set('location', location.trim())
      if (guests) params.set('guests', String(guests))
      if (bedrooms > 0) params.set('bedrooms', String(bedrooms))
      if (maxPrice > 0) params.set('maxPrice', String(maxPrice))
      router.push(`/properties?${params.toString()}`)
    },
    [location, guests, bedrooms, maxPrice, router]
  )

  const divider = <div className="hidden lg:block w-px self-stretch my-4 bg-gray-200/80" />
  const dividerMobile = <div className="h-px bg-gray-100 lg:hidden mx-5" />

  return (
    <form onSubmit={handleSearch} className="relative z-10">
      <div className="bg-white rounded-[28px] lg:rounded-full shadow-2xl shadow-black/10 ring-1 ring-black/5 flex flex-col lg:flex-row lg:items-stretch">
        {/* Destination */}
        <div className="flex flex-col justify-center gap-1.5 px-6 py-4 lg:py-3.5 flex-1 min-w-0">
          <FieldLabel icon={MapPin}>{t('searchDestination')}</FieldLabel>
          <input
            id="search-destination"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full focus:outline-none text-[15px] text-secondary font-medium placeholder-gray-400 bg-transparent"
          />
        </div>

        {dividerMobile}
        {divider}

        {/* Guests */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 lg:py-2.5 lg:flex-col lg:items-start lg:justify-center lg:gap-1.5">
          <FieldLabel icon={Users}>{t('gaesteLabel')}</FieldLabel>
          <Stepper
            label={t('gaesteLabel')}
            value={guests}
            display={String(guests)}
            min={1}
            max={16}
            onChange={setGuests}
          />
        </div>

        {dividerMobile}
        {divider}

        {/* Bedrooms */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 lg:py-2.5 lg:flex-col lg:items-start lg:justify-center lg:gap-1.5">
          <FieldLabel icon={BedDouble}>{t('schlafzimmerLabel')}</FieldLabel>
          <Stepper
            label={t('schlafzimmerLabel')}
            value={bedrooms}
            display={bedrooms === 0 ? t('any') : String(bedrooms)}
            min={0}
            max={8}
            onChange={setBedrooms}
          />
        </div>

        {dividerMobile}
        {divider}

        {/* Max price */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 lg:py-2.5 lg:flex-col lg:items-start lg:justify-center lg:gap-1.5">
          <FieldLabel icon={Euro}>{t('heroPriceLabel')}</FieldLabel>
          <Stepper
            label={t('heroPriceLabel')}
            value={maxPrice}
            display={maxPrice === 0 ? t('any') : `€${maxPrice.toLocaleString('de-DE')}`}
            min={0}
            max={3000}
            step={250}
            onChange={setMaxPrice}
          />
        </div>

        {/* Search button */}
        <div className="p-2 lg:flex lg:items-center">
          <button
            type="submit"
            className="w-full lg:w-auto h-12 lg:h-auto lg:self-stretch lg:my-2 lg:mr-1 lg:px-7 bg-primary text-white rounded-2xl lg:rounded-full flex items-center justify-center gap-2 font-semibold tracking-wide hover:shadow-lg hover:shadow-primary/30 hover:brightness-105 active:scale-[0.98] transition-all"
          >
            <Search className="w-5 h-5" />
            <span>{t('heroSearchButton')}</span>
          </button>
        </div>
      </div>
    </form>
  )
}

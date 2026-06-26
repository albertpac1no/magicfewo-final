'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { MapPin, Search, Minus, Plus, Users, BedDouble, Euro, ChevronDown } from 'lucide-react'

const MAX_PRICE_OPTIONS = [150, 250, 500, 750, 1000, 1500, 2000, 3000]

function Stepper({
  icon: Icon,
  label,
  value,
  display,
  min,
  max,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  display: string
  min: number
  max: number
  onChange: (next: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-700 truncate">{label}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          type="button"
          aria-label={`${label} -`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-600 transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-semibold text-gray-800 w-12 text-center tabular-nums whitespace-nowrap">
          {display}
        </span>
        <button
          type="button"
          aria-label={`${label} +`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-600 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export function SearchBar() {
  const t = useTranslations('properties')
  const router = useRouter()

  const [location, setLocation] = useState('')
  const [guests, setGuests] = useState(2)
  const [bedrooms, setBedrooms] = useState(0)
  const [maxPrice, setMaxPrice] = useState('')
  const [open, setOpen] = useState(false)

  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const params = new URLSearchParams()
      if (location.trim()) params.set('location', location.trim())
      if (guests) params.set('guests', String(guests))
      if (bedrooms > 0) params.set('bedrooms', String(bedrooms))
      if (maxPrice) params.set('maxPrice', maxPrice)
      router.push(`/properties?${params.toString()}`)
    },
    [location, guests, bedrooms, maxPrice, router]
  )

  const optionsSummary = [
    t('guestsCount', { count: guests }),
    bedrooms > 0 ? t('bedroomsCount', { count: bedrooms }) : t('heroAnyRooms'),
  ].join(' · ')

  return (
    <form onSubmit={handleSearch} className="relative z-10">
      <div className="bg-white rounded-3xl lg:rounded-full shadow-2xl shadow-black/10 ring-1 ring-black/5 flex flex-col lg:flex-row lg:items-stretch overflow-visible">
        {/* Destination */}
        <div className="flex items-center gap-3 px-5 sm:px-6 py-3.5 flex-1 min-w-0">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <label htmlFor="search-destination" className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-0.5">
              {t('searchDestination')}
            </label>
            <input
              id="search-destination"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full focus:outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 lg:hidden mx-5" />
        <div className="hidden lg:block w-px self-stretch my-3 bg-gray-200" />

        {/* Guests & rooms popover */}
        <div ref={popoverRef} className="relative lg:flex lg:items-stretch">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="w-full flex items-center gap-3 px-5 sm:px-6 py-3.5 lg:w-60 text-left hover:bg-gray-50/80 lg:rounded-none transition-colors"
          >
            <Users className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-0.5">
                {t('heroOptions')}
              </span>
              <span className="block text-sm text-gray-800 truncate">{optionsSummary}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div
              role="dialog"
              aria-label={t('heroOptions')}
              className="absolute z-30 left-4 right-4 lg:left-auto lg:right-0 top-full mt-2 lg:mt-3 w-auto lg:w-80 bg-white rounded-2xl shadow-2xl shadow-black/15 ring-1 ring-black/5 p-5 space-y-5"
            >
              <Stepper
                icon={Users}
                label={t('gaesteLabel')}
                value={guests}
                display={String(guests)}
                min={1}
                max={16}
                onChange={setGuests}
              />
              <div className="h-px bg-gray-100" />
              <Stepper
                icon={BedDouble}
                label={t('schlafzimmerLabel')}
                value={bedrooms}
                display={bedrooms === 0 ? t('any') : String(bedrooms)}
                min={0}
                max={8}
                onChange={setBedrooms}
              />
              <div className="h-px bg-gray-100" />
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Euro className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 truncate">{t('heroMaxPrice')}</span>
                </div>
                <div className="relative flex-shrink-0">
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="appearance-none text-sm font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer transition-colors"
                  >
                    <option value="">{t('any')}</option>
                    {MAX_PRICE_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        € {p.toLocaleString('de-DE')}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setGuests(2)
                    setBedrooms(0)
                    setMaxPrice('')
                  }}
                  className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                >
                  {t('heroClear')}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold text-white bg-primary hover:opacity-90 rounded-lg px-4 py-2 transition-opacity"
                >
                  {t('heroApply')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search button */}
        <div className="p-2 lg:p-2 lg:flex lg:items-center">
          <button
            type="submit"
            className="w-full lg:w-12 lg:h-12 h-12 bg-primary text-white rounded-2xl lg:rounded-full flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
          >
            <Search className="w-5 h-5" />
            <span className="lg:hidden">{t('heroSearchButton')}</span>
          </button>
        </div>
      </div>
    </form>
  )
}

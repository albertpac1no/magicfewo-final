'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { MapPin, Search, Minus, Plus } from 'lucide-react'

export function SearchBar() {
  const t = useTranslations('properties')
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [guests, setGuests] = useState(2)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (guests) params.set('guests', guests.toString())
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative z-10">
      <div className="bg-white rounded-full shadow-2xl border border-gray-100 flex flex-col lg:flex-row lg:items-center lg:divide-x lg:divide-gray-200 overflow-hidden">
        {/* Destination */}
        <div className="flex items-center gap-3 px-6 py-4 lg:py-3 flex-1 min-w-0">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-0.5">
              {t('searchDestination')}
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full focus:outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Divider on mobile */}
        <div className="h-px bg-gray-100 lg:hidden mx-4" />

        {/* Guests + Submit */}
        <div className="flex items-center gap-3 px-6 py-4 lg:py-3 lg:w-52">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-0.5">
              {t('guests')}
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-500 transition-colors flex-shrink-0"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm font-medium text-gray-700 w-16 text-center">
                {guests} {guests === 1 ? t('person') : t('persons')}
              </span>
              <button
                type="button"
                onClick={() => setGuests((g) => Math.min(12, g + 1))}
                className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-500 transition-colors flex-shrink-0"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center hover:opacity-90 transition-colors shadow-md hover:shadow-lg flex-shrink-0"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  )
}

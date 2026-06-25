'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Search, Users, Bed, Bath, Euro, X, Tag, SlidersHorizontal } from 'lucide-react'

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('properties')

  const location = searchParams.get('location') ?? ''
  const minPrice = searchParams.get('minPrice') ?? ''
  const maxPrice = searchParams.get('maxPrice') ?? ''
  const guests = searchParams.get('guests') ?? ''
  const bedrooms = searchParams.get('bedrooms') ?? ''
  const bathrooms = searchParams.get('bathrooms') ?? ''
  const specialOffers = searchParams.get('specialOffers') === 'true'

  const activeFilterCount = [location, minPrice, maxPrice, guests, bedrooms, bathrooms].filter(Boolean).length + (specialOffers ? 1 : 0)

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`/properties?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearAll = () => {
    router.push('/properties')
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100/80 p-6 md:p-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-sm font-bold text-secondary uppercase tracking-wider">{t('filter')}</h2>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary bg-gray-50 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all duration-200"
          >
            <X className="w-3 h-3" />
            {t('reset', { count: activeFilterCount })}
          </button>
        )}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {t('location')}
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={location}
              onChange={(e) => updateParam('location', e.target.value)}
              placeholder={t('locationPlaceholder')}
              className="input-base pl-10"
            />
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {t('pricePerNight')}
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Euro className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                placeholder="Min"
                min={0}
                className="input-base pl-10"
              />
            </div>
            <span className="text-gray-300 font-light text-lg">&ndash;</span>
            <div className="relative flex-1">
              <Euro className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                placeholder="Max"
                min={0}
                className="input-base pl-10"
              />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {t('gaesteLabel')}
          </label>
          <div className="relative">
            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={guests}
              onChange={(e) => updateParam('guests', e.target.value)}
              className="select-base pl-10"
            >
              <option value="">{t('any')}</option>
              {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                <option key={num} value={num}>
                  {t('guestsFilter', { count: num })}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {t('schlafzimmerLabel')}
          </label>
          <div className="relative">
            <Bed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={bedrooms}
              onChange={(e) => updateParam('bedrooms', e.target.value)}
              className="select-base pl-10"
            >
              <option value="">{t('any')}</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {t('rooms', { count: num })}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {t('badezimmerLabel')}
          </label>
          <div className="relative">
            <Bath className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={bathrooms}
              onChange={(e) => updateParam('bathrooms', e.target.value)}
              className="select-base pl-10"
            >
              <option value="">{t('any')}</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {t('baths', { count: num })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Special offers toggle */}
      <div className="mt-5 pt-5 border-t border-gray-100">
        <label className="inline-flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={specialOffers}
              onChange={(e) => updateParam('specialOffers', e.target.checked ? 'true' : '')}
              className="peer sr-only"
            />
            <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-primary transition-colors duration-200" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform duration-200" />
          </div>
          <Tag className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors" />
          <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
            {t('specialOffersOnly')}
          </span>
        </label>
      </div>
    </div>
  )
}

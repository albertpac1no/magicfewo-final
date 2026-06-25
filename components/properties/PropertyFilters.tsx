'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Search, Users, Bed, Bath, Euro, X, Tag } from 'lucide-react'

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

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
      // Reset to page 1 on filter change
      params.delete('page')
      router.push(`/properties?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearAll = () => {
    router.push('/properties')
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-secondary uppercase tracking-wide">Filter</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <X className="w-3 h-3" />
            Filter zurücksetzen ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ort</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={location}
              onChange={(e) => updateParam('location', e.target.value)}
              placeholder="Stadt oder Region"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preis pro Nacht</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Euro className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                placeholder="Min"
                min={0}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <span className="text-gray-500">-</span>
            <div className="relative flex-1">
              <Euro className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                placeholder="Max"
                min={0}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gäste</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={guests}
              onChange={(e) => updateParam('guests', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
            >
              <option value="">Beliebig</option>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num}+ Gäste
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Schlafzimmer</label>
          <div className="relative">
            <Bed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={bedrooms}
              onChange={(e) => updateParam('bedrooms', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
            >
              <option value="">Beliebig</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}+ Schlafzimmer
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Badezimmer</label>
          <div className="relative">
            <Bath className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={bathrooms}
              onChange={(e) => updateParam('bathrooms', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
            >
              <option value="">Beliebig</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}+ Badezimmer
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Special offers toggle */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={specialOffers}
            onChange={(e) => updateParam('specialOffers', e.target.checked ? 'true' : '')}
            className="w-4 h-4 rounded text-primary focus:ring-primary/20"
          />
          <Tag className="w-4 h-4 text-primary" />
          <span className="text-sm text-gray-700 font-medium">Nur Sonderangebote</span>
        </label>
      </div>
    </div>
  )
}

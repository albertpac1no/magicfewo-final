'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, Pencil, Trash2, MapPin, User, Calendar } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Property } from '@/lib/types'
import { deleteProperty } from '@/app/actions/property'
import { Link } from '@/i18n/navigation'

interface AdminPropertiesClientProps {
  properties: Property[]
}

export function AdminPropertiesClient({ properties }: AdminPropertiesClientProps) {
  const router = useRouter()
  const t = useTranslations('admin')
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = properties.filter((p) => {
    const term = search.toLowerCase()
    return (
      p.title.toLowerCase().includes(term) ||
      p.location.toLowerCase().includes(term) ||
      p.city?.toLowerCase().includes(term) ||
      p.country?.toLowerCase().includes(term)
    )
  })

  const handleDelete = async (id: string) => {
    if (!confirm(t('properties.deleteConfirm'))) return
    setDeletingId(id)
    const result = await deleteProperty(id)
    if (result.error) {
      alert(result.error)
    }
    setDeletingId(null)
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={t('properties.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full flex items-center justify-center p-8 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('properties.noProperties')}</h3>
              <p className="text-gray-600">
                {search ? t('properties.tryDifferentSearch') : t('properties.noPropertiesExist')}
              </p>
            </div>
          </div>
        ) : (
          filtered.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={
                    property.images?.[0] ||
                    'https://via.placeholder.com/800x600?text=Kein+Bild'
                  }
                  alt={property.title}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{property.title}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-1 shrink-0" />
                  <span className="truncate">{property.location}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {t('properties.maxGuests', { count: property.max_guests })}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(property.created_at).toLocaleDateString('de-DE')}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-primary font-bold">
                    {property.price_per_night} €{' '}
                    <span className="text-gray-500 text-sm font-normal">{t('properties.perNight')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="p-2 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id)}
                      disabled={deletingId === property.id || isPending}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

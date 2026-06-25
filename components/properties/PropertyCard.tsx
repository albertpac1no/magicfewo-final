import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { MapPin, Bed, Bath, Users, Star } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { Property } from '@/lib/types'

const FALLBACK_IMAGE = '/images/hero-apartment-interior.jpg'

interface PropertyCardProps {
  property: Property
}

export async function PropertyCard({ property }: PropertyCardProps) {
  const t = await getTranslations('properties')
  const imageUrl = property.images?.[0] || FALLBACK_IMAGE

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block bg-white rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={imageUrl}
          alt={t('propertyAlt', { title: property.title, location: property.location })}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        {property.is_special_offer && property.special_offer_price && (
          <div className="absolute top-3 left-3">
            <span className="bg-primary text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-primary/30 uppercase tracking-wide">
              {t('specialOfferBadge')}
            </span>
          </div>
        )}
        {property.review_overall_rating != null && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-sm">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-secondary">
                {property.review_overall_rating.toFixed(1)}
              </span>
              {property.review_count != null && (
                <span className="text-[10px] text-gray-400">({property.review_count})</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-secondary text-[15px] leading-snug mb-1.5 group-hover:text-primary transition-colors duration-200 line-clamp-1">
          {property.title}
        </h3>
        <div className="flex items-center text-gray-400 text-xs mb-4">
          <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Amenity chips */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <span className="inline-flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-md">
            <Bed className="w-3 h-3 text-gray-400" />
            {property.bedrooms}
          </span>
          <span className="inline-flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-md">
            <Bath className="w-3 h-3 text-gray-400" />
            {property.bathrooms}
          </span>
          <span className="inline-flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-md">
            <Users className="w-3 h-3 text-gray-400" />
            {property.max_guests}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between pt-4 border-t border-gray-50">
          <div>
            {property.is_special_offer && property.special_offer_price ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-primary">
                  {property.special_offer_price} €
                </span>
                <span className="text-sm text-gray-300 line-through">
                  {property.price_per_night} €
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-secondary">
                {property.price_per_night} €
              </span>
            )}
            <span className="text-[11px] text-gray-400 block mt-0.5">{t('perNightLabel')}</span>
          </div>
          <span className="text-xs font-semibold text-primary bg-primary/5 border border-primary/20 px-3.5 py-2 rounded-lg group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200">
            {t('viewProperty')}
          </span>
        </div>
      </div>
    </Link>
  )
}

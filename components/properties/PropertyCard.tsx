import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { MapPin, Bed, Bath, Users, Star } from 'lucide-react'
import type { Property } from '@/lib/types'

const FALLBACK_IMAGE = '/images/hero-apartment-interior.jpg'

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.images?.[0] || FALLBACK_IMAGE

  return (
    <Link
      href={`/properties/${property.id}`}
      className="card block group hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={imageUrl}
          alt={`${property.title} – Ferienwohnung in ${property.location}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {property.is_special_offer && property.special_offer_price && (
          <div className="absolute top-3 left-3">
            <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              Sonderangebot
            </span>
          </div>
        )}
        {property.review_overall_rating != null && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-secondary">
                {property.review_overall_rating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-secondary text-base leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {property.title}
        </h3>
        <div className="flex items-center text-gray-400 text-xs mb-3">
          <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5" />
            {property.bedrooms} Schlafzimmer
          </span>
          <span className="text-gray-300">&middot;</span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5" />
            {property.bathrooms} Bad
          </span>
          <span className="text-gray-300">&middot;</span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {property.max_guests} Gäste
          </span>
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-gray-100">
          <div>
            {property.is_special_offer && property.special_offer_price ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-primary">
                  {property.special_offer_price} €
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {property.price_per_night} €
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-secondary">
                {property.price_per_night} €
              </span>
            )}
            <span className="text-xs text-gray-400 block">/ Nacht</span>
          </div>
          <span className="text-xs font-medium text-primary border border-primary/30 px-3 py-1.5 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
            Ansehen
          </span>
        </div>
      </div>
    </Link>
  )
}

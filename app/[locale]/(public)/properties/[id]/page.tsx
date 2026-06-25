import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { getSettings } from '@/lib/settings'
import { formatDate } from '@/lib/utils'
import {
  ChevronLeft, MapPin, Star, Bed, Bath, Users,
  Shield, Clock, CheckCircle,
} from 'lucide-react'
import { PropertyImageGrid } from '@/components/properties/PropertyImageGrid'
import { AmenityGrid } from '@/components/properties/AmenityGrid'
import { BookingCard } from '@/components/properties/BookingCard'
import { AvailabilityCalendar } from '@/components/properties/AvailabilityCalendar'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ExpandableDescription } from '@/components/properties/ExpandableDescription'
import { vacationRentalJsonLd } from '@/lib/structured-data'

interface Props {
  params: Promise<{ id: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params
  const supabase = await createSupabaseServer()
  const t = await getTranslations({ locale, namespace: 'meta' })
  const tp = await getTranslations({ locale, namespace: 'properties' })
  const { data: property } = await supabase
    .from('properties')
    .select('title, description, images')
    .eq('id', id)
    .single()

  if (!property) return { title: tp('notFoundTitle') }

  const desc = property.description?.slice(0, 160) ?? ''

  return {
    title: t('propertyDetail.title', { title: property.title }),
    description: desc,
    openGraph: {
      title: property.title,
      description: desc,
      url: `/properties/${id}`,
      images: property.images?.[0] ? [{ url: property.images[0], width: 1200, height: 630, alt: property.title }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description: desc,
      images: property.images?.[0] ? [property.images[0]] : undefined,
    },
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const t = await getTranslations('properties')

  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !property) notFound()

  // Fetch owner profile
  const { data: ownerProfile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, created_at')
    .eq('id', property.owner_id)
    .single()

  const settings = await getSettings()

  const displayRating = property.review_overall_rating

  return (
    <div className="py-8 md:py-12 bg-gray-light min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vacationRentalJsonLd(property)) }}
      />
      <div className="container">
        <Breadcrumbs items={[
          { label: t('title'), href: '/properties' },
          { label: property.title, href: `/properties/${property.id}` },
        ]} />

        {/* Property Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2 leading-tight">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="w-4 h-4 mr-1 text-primary flex-shrink-0" />
                <span>{property.location}</span>
              </div>
            </div>
            {displayRating != null && (
              <div className="flex items-center gap-1.5 mt-1 md:mt-0">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-secondary text-sm">
                  {displayRating.toFixed(1)}
                </span>
                {property.review_count != null && (
                  <span className="text-gray-400 text-sm">
                    ({t('reviews', { count: property.review_count })})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Spec Strip */}
          <div className="flex items-center gap-5 flex-wrap text-sm text-gray-600 border-t border-gray-200 pt-4 mt-4">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-gray-400" />
              <span>{property.bedrooms} {t('bedrooms')}</span>
            </div>
            <span className="text-gray-300">&middot;</span>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-gray-400" />
              <span>{property.bathrooms} {t('bathrooms')}</span>
            </div>
            <span className="text-gray-300">&middot;</span>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{t('maxGuests', { count: property.max_guests })}</span>
            </div>
            {property.is_special_offer && (
              <>
                <span className="text-gray-300">&middot;</span>
                <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                  {t('specialOffer')}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <PropertyImageGrid images={property.images ?? []} title={property.title} />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card p-6">
              <h2 className="section-title mb-4">{t('description')}</h2>
              <ExpandableDescription text={property.description || ''} />
            </div>

            {/* Details */}
            <div className="card p-6">
              <h2 className="section-title mb-5">{t('details')}</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center bg-gray-light rounded-xl py-5 gap-2 text-center">
                  <Bed className="w-6 h-6 text-primary" />
                  <span className="text-lg font-bold text-secondary">{property.bedrooms}</span>
                  <span className="text-xs text-gray-500">{t('bedrooms')}</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-gray-light rounded-xl py-5 gap-2 text-center">
                  <Bath className="w-6 h-6 text-primary" />
                  <span className="text-lg font-bold text-secondary">{property.bathrooms}</span>
                  <span className="text-xs text-gray-500">{t('bathrooms')}</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-gray-light rounded-xl py-5 gap-2 text-center">
                  <Users className="w-6 h-6 text-primary" />
                  <span className="text-lg font-bold text-secondary">{property.max_guests}</span>
                  <span className="text-xs text-gray-500">{property.max_guests === 1 ? t('guest') : t('guests')}</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="card p-6">
                <h2 className="section-title mb-5">{t('amenities')}</h2>
                <AmenityGrid amenities={property.amenities} />
              </div>
            )}

            {/* Host Information */}
            {ownerProfile && (
              <div className="card p-6">
                <h2 className="section-title mb-5">{t('aboutHost')}</h2>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {ownerProfile.avatar_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={ownerProfile.avatar_url}
                        alt={ownerProfile.full_name ? t('hostAvatarAlt', { name: ownerProfile.full_name }) : t('hostAvatarAltDefault')}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                        {ownerProfile.full_name?.charAt(0) ?? '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-secondary">
                        {ownerProfile.full_name ?? t('host')}
                      </h3>
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> {t('verified')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      {ownerProfile.created_at
                        ? t('hostSince', { date: formatDate(ownerProfile.created_at) })
                        : t('unknown')}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{t('respondsWithinHour')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span>{t('identityConfirmed')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <BookingCard
              property={property}
              cleaningFee={settings.booking_cleaning_fee}
              serviceFee={settings.booking_service_fee}
              freeCancellationHours={settings.booking_free_cancellation_hours}
            />
          </div>
        </div>

        {/* Availability Calendar */}
        <div className="mt-8 max-w-md">
          <AvailabilityCalendar propertyId={property.id} />
        </div>
      </div>

      {/* Spacer for mobile fixed bottom bar */}
      <div className="h-20 lg:hidden" />
    </div>
  )
}

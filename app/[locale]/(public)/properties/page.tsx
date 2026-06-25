import { Suspense } from 'react'
import { createSupabaseServer } from '@/lib/supabase/server'
import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { PropertyFilters } from '@/components/properties/PropertyFilters'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('properties.title'),
    description: t('properties.description'),
    keywords: t('properties.keywords'),
    openGraph: {
      title: t('properties.title'),
      description: t('properties.description'),
      url: '/properties',
    },
  }
}

const PAGE_SIZE = 12

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams
  const t = await getTranslations('properties')
  const location = typeof params.location === 'string' ? params.location : ''
  const minPrice = typeof params.minPrice === 'string' ? Number(params.minPrice) : undefined
  const maxPrice = typeof params.maxPrice === 'string' ? Number(params.maxPrice) : undefined
  const guests = typeof params.guests === 'string' ? Number(params.guests) : undefined
  const bedrooms = typeof params.bedrooms === 'string' ? Number(params.bedrooms) : undefined
  const bathrooms = typeof params.bathrooms === 'string' ? Number(params.bathrooms) : undefined
  const specialOffers = params.specialOffers === 'true'
  const page = typeof params.page === 'string' ? Math.max(1, Number(params.page)) : 1

  const offset = (page - 1) * PAGE_SIZE

  const supabase = await createSupabaseServer()
  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })

  if (location) {
    query = query.or(
      `location.ilike.%${location}%,city.ilike.%${location}%,country.ilike.%${location}%`
    )
  }
  if (minPrice != null && !isNaN(minPrice)) {
    query = query.gte('price_per_night', minPrice)
  }
  if (maxPrice != null && !isNaN(maxPrice)) {
    query = query.lte('price_per_night', maxPrice)
  }
  if (guests != null && !isNaN(guests)) {
    query = query.gte('max_guests', guests)
  }
  if (bedrooms != null && !isNaN(bedrooms)) {
    query = query.gte('bedrooms', bedrooms)
  }
  if (bathrooms != null && !isNaN(bathrooms)) {
    query = query.gte('bathrooms', bathrooms)
  }
  if (specialOffers) {
    query = query.eq('is_special_offer', true).not('special_offer_price', 'is', null)
  }

  query = query.order('created_at', { ascending: false }).range(offset, offset + PAGE_SIZE - 1)

  const { data: properties, count } = await query

  const totalCount = count ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Build pagination URL helper
  function pageUrl(p: number) {
    const sp = new URLSearchParams()
    if (location) sp.set('location', location)
    if (minPrice != null) sp.set('minPrice', String(minPrice))
    if (maxPrice != null) sp.set('maxPrice', String(maxPrice))
    if (guests != null) sp.set('guests', String(guests))
    if (bedrooms != null) sp.set('bedrooms', String(bedrooms))
    if (bathrooms != null) sp.set('bathrooms', String(bathrooms))
    if (specialOffers) sp.set('specialOffers', 'true')
    if (p > 1) sp.set('page', String(p))
    const qs = sp.toString()
    return `/properties${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="py-8 md:py-12 bg-gray-light min-h-screen">
      <div className="container">
        <Breadcrumbs items={[{ label: t('title'), href: '/properties' }]} />
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-500 text-sm">
            {t('foundCount', { count: totalCount })}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Suspense fallback={null}>
            <PropertyFilters />
          </Suspense>
        </div>

        {/* Grid */}
        <PropertyGrid properties={properties ?? []} />

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={pageUrl(page - 1)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                {t('back')}
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .reduce<(number | string)[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((item, i) =>
                typeof item === 'string' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <Link
                    key={item}
                    href={pageUrl(item)}
                    className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                      item === page
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {item}
                  </Link>
                )
              )}

            {page < totalPages && (
              <Link
                href={pageUrl(page + 1)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('next')}
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  )
}

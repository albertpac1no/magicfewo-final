import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import type { Property } from '@/lib/types'
import { PropertyCard } from '@/components/properties/PropertyCard'

interface FeaturedPropertiesProps {
  properties: Property[]
}

export async function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  const t = await getTranslations('properties')

  return (
    <section className="py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-secondary mb-1">{t('featuredTitle')}</h2>
          <p className="text-gray-500 text-sm">{t('featuredSubtitle')}</p>
        </div>
        <Link
          href="/properties"
          className="text-primary font-medium text-sm hover:opacity-80 transition-colors hidden sm:block"
        >
          {t('viewAll')}
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">
          {t('noProperties')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  )
}

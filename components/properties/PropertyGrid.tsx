import { getTranslations } from 'next-intl/server'
import { PropertyCard } from './PropertyCard'
import type { Property } from '@/lib/types'

interface PropertyGridProps {
  properties: Property[]
}

export async function PropertyGrid({ properties }: PropertyGridProps) {
  const t = await getTranslations('properties')

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{t('noPropertiesFound')}</p>
        <p className="text-gray-400 mt-2">{t('tryOtherCriteria')}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}

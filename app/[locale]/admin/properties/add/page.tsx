import { PropertyForm } from '@/components/admin/PropertyForm'
import { getTranslations } from 'next-intl/server'

export default async function AddPropertyPage() {
  const t = await getTranslations('admin')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('properties.addProperty')}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {t('properties.addSubtitle')}
        </p>
      </div>
      <PropertyForm mode="create" />
    </div>
  )
}

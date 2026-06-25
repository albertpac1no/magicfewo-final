import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export default async function PropertyNotFound() {
  const t = await getTranslations('properties')
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-700">{t('notFoundTitle')}</h1>
        <p className="text-gray-500 mt-4">{t('notFoundText')}</p>
        <Link href="/properties" className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition">
          {t('showAll')}
        </Link>
      </div>
    </div>
  )
}

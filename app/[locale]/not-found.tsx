import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  const t = await getTranslations('meta')
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">{t('notFound.heading')}</h2>
        <p className="text-gray-500 mt-2">{t('notFound.description')}</p>
        <Link href="/" className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition">
          {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  )
}

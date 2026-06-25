import { getTranslations } from 'next-intl/server'

export async function Newsletter() {
  const t = await getTranslations('common')

  return (
    <section className="py-16 relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary/5 rounded-full -z-10" />

      <h2 className="text-2xl font-bold text-secondary text-center mb-4">
        {t('newsletterTitle')}
      </h2>
      <p className="text-gray-custom text-center mb-8">
        {t('newsletterSubtitle')}
      </p>

      <div className="max-w-xl mx-auto">
        <div className="flex gap-4">
          <input
            type="email"
            placeholder={t('newsletterPlaceholder')}
            className="flex-1 border border-gray-200 rounded-full px-6 py-3 focus:outline-none focus:border-primary text-sm"
          />
          <button className="btn-primary whitespace-nowrap">
            {t('subscribe')}
          </button>
        </div>
      </div>
    </section>
  )
}

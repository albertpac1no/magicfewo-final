import { ShieldCheck, Star, HeadphonesIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function ValueProps() {
  const t = await getTranslations('properties')

  const props = [
    {
      icon: ShieldCheck,
      title: t('secureBookingTitle'),
      text: t('secureBookingText'),
    },
    {
      icon: Star,
      title: t('verifiedTitle'),
      text: t('verifiedText'),
    },
    {
      icon: HeadphonesIcon,
      title: t('supportTitle'),
      text: t('supportText'),
    },
  ]

  return (
    <section className="py-14 bg-gray-light rounded-2xl px-6 md:px-10 my-8">
      <h2 className="text-2xl font-bold text-secondary text-center mb-2">{t('valuePropsTitle')}</h2>
      <p className="text-gray-500 text-sm text-center mb-10">
        {t('valuePropsSubtitle')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {props.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex flex-col items-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold text-secondary mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

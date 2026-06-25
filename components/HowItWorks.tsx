import { Search, CreditCard, Palmtree } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function HowItWorks() {
  const t = await getTranslations('common')

  const steps = [
    {
      icon: Search,
      label: t('step1Label'),
      title: t('step1Title'),
      text: t('step1Text'),
    },
    {
      icon: CreditCard,
      label: t('step2Label'),
      title: t('step2Title'),
      text: t('step2Text'),
    },
    {
      icon: Palmtree,
      label: t('step3Label'),
      title: t('step3Title'),
      text: t('step3Text'),
    },
  ]

  return (
    <section className="py-20">
      <div className="text-center mb-14">
        <h2 className="text-3xl font-bold text-secondary mb-3">{t('howItWorks')}</h2>
        <div className="w-16 h-1 bg-primary/30 rounded-full mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {steps.map(({ icon: Icon, label, title, text }, idx) => (
          <div key={idx} className="relative text-center group">
            <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-primary/5 to-primary/15 mb-6 group-hover:scale-105 transition-transform duration-300">
              <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-md">
                {idx + 1}
              </div>
              <Icon className="w-10 h-10 text-primary" />
            </div>
            <span className="block text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              {label}
            </span>
            <h3 className="text-lg font-bold text-secondary mb-3">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

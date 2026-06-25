import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'

export async function CtaBanner() {
  const t = await getTranslations('common')

  return (
    <section className="py-20">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        <Image
          src="/images/hero-villa-pool.jpg"
          alt="Luxuriöse Ferienvilla"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-secondary/40" />

        <div className="relative px-8 md:px-16 py-16 md:py-20">
          <div className="max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {t('ctaTitle')}
            </h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              {t('ctaText')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/properties"
                className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3"
              >
                {t('bookNow')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 text-white border border-white/30 rounded-full px-8 py-3 text-base font-medium hover:bg-white/10 transition-colors"
              >
                {t('ctaAdvice')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

const destinations = [
  {
    slug: '/reiseziele/europa',
    image: '/images/hero-coastal-village.jpg',
    labelKey: 'europa' as const,
    propertyCount: '2.400+',
  },
  {
    slug: '/reiseziele/asien',
    image: '/images/destination-asien-hero.jpg',
    labelKey: 'asien' as const,
    propertyCount: '1.800+',
  },
  {
    slug: '/reiseziele/amerika',
    image: '/images/destination-amerika-hero.jpg',
    labelKey: 'amerika' as const,
    propertyCount: '1.200+',
  },
  {
    slug: '/reiseziele/afrika',
    image: '/images/destination-afrika-hero.jpg',
    labelKey: 'afrika' as const,
    propertyCount: '900+',
  },
]

export async function PopularDestinations() {
  const t = await getTranslations('common')

  return (
    <section className="py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-secondary mb-3">
          {t('popularDestinations')}
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          {t('popularDestinationsSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {destinations.map((dest) => (
          <Link
            key={dest.slug}
            href={dest.slug}
            className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            <Image
              src={dest.image}
              alt={t(`destinations.${dest.labelKey}.title`)}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-white font-bold text-lg mb-1 group-hover:translate-y-[-2px] transition-transform duration-300">
                {t(`destinations.${dest.labelKey}.title`).replace('Entdecken Sie ', '').replace('Discover ', '')}
              </h3>
              <p className="text-white/70 text-sm">{dest.propertyCount} {t('properties')}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

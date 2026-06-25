import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@supabase/supabase-js'
import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import type { Property } from '@/lib/types'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('offers.title'),
    description: t('offers.description'),
    openGraph: {
      title: t('offers.title'),
      description: t('offers.description'),
      url: '/angebote',
    },
  }
}

async function getSpecialOffers(): Promise<Property[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('is_special_offer', true)
      .order('special_offer_price', { ascending: true })
    return (data as Property[]) ?? []
  } catch {
    return []
  }
}

export default async function AngebotePage() {
  const specialOffers = await getSpecialOffers()
  const t = await getTranslations('common')

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <Image
          src="/images/offers-hero.jpg"
          alt="Aktuelle Sonderangebote für Ferienwohnungen bei MagicFewo"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">{t('offers.heroTitle')}</h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl">
              {t('offers.heroSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <Breadcrumbs items={[{ label: 'Angebote', href: '/angebote' }]} />
        {specialOffers.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-secondary mb-4">{t('offers.noOffersTitle')}</h2>
            <p className="text-gray-600">
              {t('offers.noOffersText')}
            </p>
          </div>
        ) : (
          <PropertyGrid properties={specialOffers} />
        )}
      </div>
    </div>
  )
}

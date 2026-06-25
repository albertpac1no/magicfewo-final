import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DestinationPage, type Destination } from '@/components/DestinationPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('destinations.asien.title'),
    description: t('destinations.asien.description'),
    openGraph: {
      title: t('destinations.asien.title'),
      description: t('destinations.asien.description'),
      url: '/reiseziele/asien',
    },
  }
}

export default async function AsienPage() {
  const [tC, tP] = await Promise.all([
    getTranslations('common'),
    getTranslations('pages'),
  ])
  const destinations = tP.raw('reiseziele.asien.destinations') as Destination[]
  return (
    <DestinationPage
      heroImage="/images/destination-asien-hero.jpg"
      heroAlt={tP('reiseziele.asienAlt')}
      title={tC('destinations.asien.title')}
      subtitle={tC('destinations.asien.subtitle')}
      destinations={destinations}
      slug="asien"
    />
  )
}

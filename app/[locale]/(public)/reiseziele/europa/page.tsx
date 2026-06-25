import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DestinationPage, type Destination } from '@/components/DestinationPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('destinations.europa.title'),
    description: t('destinations.europa.description'),
    openGraph: {
      title: t('destinations.europa.title'),
      description: t('destinations.europa.description'),
      url: '/reiseziele/europa',
    },
  }
}

export default async function EuropaPage() {
  const [tC, tP] = await Promise.all([
    getTranslations('common'),
    getTranslations('pages'),
  ])
  const destinations = tP.raw('reiseziele.europa.destinations') as Destination[]
  return (
    <DestinationPage
      heroImage="/images/hero-coastal-village.jpg"
      heroAlt={tP('reiseziele.europaAlt')}
      title={tC('destinations.europa.title')}
      subtitle={tC('destinations.europa.subtitle')}
      destinations={destinations}
      slug="europa"
    />
  )
}

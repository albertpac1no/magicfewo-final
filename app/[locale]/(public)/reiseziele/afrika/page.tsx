import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DestinationPage, type Destination } from '@/components/DestinationPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('destinations.afrika.title'),
    description: t('destinations.afrika.description'),
    openGraph: {
      title: t('destinations.afrika.title'),
      description: t('destinations.afrika.description'),
      url: '/reiseziele/afrika',
    },
  }
}

export default async function AfrikaPage() {
  const [tC, tP] = await Promise.all([
    getTranslations('common'),
    getTranslations('pages'),
  ])
  const destinations = tP.raw('reiseziele.afrika.destinations') as Destination[]
  return (
    <DestinationPage
      heroImage="/images/destination-afrika-hero.jpg"
      heroAlt={tP('reiseziele.afrikaAlt')}
      title={tC('destinations.afrika.title')}
      subtitle={tC('destinations.afrika.subtitle')}
      destinations={destinations}
      slug="afrika"
    />
  )
}

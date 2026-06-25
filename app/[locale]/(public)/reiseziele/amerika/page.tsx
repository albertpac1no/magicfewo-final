import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DestinationPage, type Destination } from '@/components/DestinationPage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('destinations.amerika.title'),
    description: t('destinations.amerika.description'),
    openGraph: {
      title: t('destinations.amerika.title'),
      description: t('destinations.amerika.description'),
      url: '/reiseziele/amerika',
    },
  }
}

export default async function AmerikaPage() {
  const [tC, tP] = await Promise.all([
    getTranslations('common'),
    getTranslations('pages'),
  ])
  const destinations = tP.raw('reiseziele.amerika.destinations') as Destination[]
  return (
    <DestinationPage
      heroImage="/images/destination-amerika-hero.jpg"
      heroAlt={tP('reiseziele.amerikaAlt')}
      title={tC('destinations.amerika.title')}
      subtitle={tC('destinations.amerika.subtitle')}
      destinations={destinations}
      slug="amerika"
    />
  )
}

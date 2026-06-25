import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DestinationPage } from '@/components/DestinationPage'

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

const destinations = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    title: 'New York',
    country: 'USA',
    description: 'Erleben Sie den American Dream in der Stadt, die niemals schläft, mit ihrer ikonischen Skyline.',
    rating: 4.8,
    price: '999',
    duration: '7 Tage',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325',
    title: 'Rio de Janeiro',
    country: 'Brasilien',
    description: 'Genießen Sie die brasilianische Lebensfreude zwischen Copacabana und Zuckerhut.',
    rating: 4.7,
    price: '849',
    duration: '8 Tage',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f',
    title: 'Vancouver',
    country: 'Kanada',
    description: 'Entdecken Sie die perfekte Harmonie zwischen Stadt und Natur an der kanadischen Westküste.',
    rating: 4.6,
    price: '929',
    duration: '6 Tage',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542',
    title: 'Cancún',
    country: 'Mexiko',
    description: 'Entspannen Sie an traumhaften Karibikstränden und erkunden Sie Maya-Ruinen.',
    rating: 4.7,
    price: '799',
    duration: '7 Tage',
  },
]

export default async function AmerikaPage() {
  const t = await getTranslations('common')
  return (
    <DestinationPage
      heroImage="/images/destination-amerika-hero.jpg"
      heroAlt="Amerika"
      title={t('destinations.amerika.title')}
      subtitle={t('destinations.amerika.subtitle')}
      destinations={destinations}
      slug="amerika"
    />
  )
}

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DestinationPage } from '@/components/DestinationPage'

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

const destinations = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a',
    title: 'Paris',
    country: 'Frankreich',
    description: 'Entdecken Sie die Stadt der Liebe mit ihrem weltberühmten Eiffelturm und der einzigartigen Atmosphäre.',
    rating: 4.8,
    price: '599',
    duration: '4 Tage',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f',
    title: 'Rom',
    country: 'Italien',
    description: 'Tauchen Sie ein in die Geschichte der ewigen Stadt mit ihren antiken Ruinen und dem Vatikan.',
    rating: 4.7,
    price: '549',
    duration: '5 Tage',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
    title: 'London',
    country: 'England',
    description: 'Erleben Sie die britische Hauptstadt mit ihrer reichen Kultur und modernen Atmosphäre.',
    rating: 4.6,
    price: '629',
    duration: '4 Tage',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1542820229-081e0c12af0b',
    title: 'Barcelona',
    country: 'Spanien',
    description: 'Genießen Sie die katalanische Kultur, Gaudís Architektur und mediterranes Flair.',
    rating: 4.7,
    price: '579',
    duration: '5 Tage',
  },
]

export default async function EuropaPage() {
  const t = await getTranslations('common')
  return (
    <DestinationPage
      heroImage="https://images.unsplash.com/photo-1485081669829-bacb8c7bb1f3"
      heroAlt="Europa"
      title={t('destinations.europa.title')}
      subtitle={t('destinations.europa.subtitle')}
      destinations={destinations}
      slug="europa"
    />
  )
}

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DestinationPage } from '@/components/DestinationPage'

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

const destinations = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5',
    title: 'Kapstadt',
    country: 'Südafrika',
    description: 'Erleben Sie die Schönheit des Tafelbergs und die pulsierende Kultur der Regenbogennation.',
    rating: 4.8,
    price: '899',
    duration: '8 Tage',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6',
    title: 'Marrakesch',
    country: 'Marokko',
    description: 'Tauchen Sie ein in die farbenfrohe Welt der Medina und erleben Sie orientalisches Flair.',
    rating: 4.7,
    price: '749',
    duration: '6 Tage',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5',
    title: 'Sansibar',
    country: 'Tansania',
    description: 'Entspannen Sie an traumhaften Stränden und erkunden Sie die historische Stone Town.',
    rating: 4.9,
    price: '829',
    duration: '7 Tage',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53',
    title: 'Viktoriafälle',
    country: 'Simbabwe',
    description: 'Bestaunen Sie eines der größten Naturwunder der Welt in seiner ganzen Pracht.',
    rating: 4.8,
    price: '949',
    duration: '6 Tage',
  },
]

export default async function AfrikaPage() {
  const t = await getTranslations('common')
  return (
    <DestinationPage
      heroImage="/images/destination-afrika-hero.jpg"
      heroAlt="Afrika"
      title={t('destinations.afrika.title')}
      subtitle={t('destinations.afrika.subtitle')}
      destinations={destinations}
      slug="afrika"
    />
  )
}

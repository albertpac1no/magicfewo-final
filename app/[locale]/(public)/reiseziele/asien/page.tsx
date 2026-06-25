import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DestinationPage } from '@/components/DestinationPage'

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

const destinations = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d',
    title: 'Tokyo',
    country: 'Japan',
    description: 'Erleben Sie die perfekte Mischung aus Tradition und Moderne in der pulsierenden Metropole Japans.',
    rating: 4.9,
    price: '899',
    duration: '7 Tage',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1549893072-8b3c7c5b9b05',
    title: 'Bangkok',
    country: 'Thailand',
    description: 'Tauchen Sie ein in die lebendige Kultur Thailands mit seinen Tempeln und der weltberühmten Küche.',
    rating: 4.7,
    price: '649',
    duration: '6 Tage',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1536599424071-0b215a388ba7',
    title: 'Bali',
    country: 'Indonesien',
    description: 'Entspannen Sie auf der Insel der Götter mit ihren traumhaften Stränden und der spirituellen Atmosphäre.',
    rating: 4.8,
    price: '749',
    duration: '8 Tage',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1547150492-da7ff1742941',
    title: 'Seoul',
    country: 'Südkorea',
    description: 'Entdecken Sie die dynamische Hauptstadt Südkoreas mit ihrer K-Pop Kultur und historischen Palästen.',
    rating: 4.6,
    price: '829',
    duration: '6 Tage',
  },
]

export default async function AsienPage() {
  const t = await getTranslations('common')
  return (
    <DestinationPage
      heroImage="https://images.unsplash.com/photo-1464817739973-0128fe77aaa1"
      heroAlt="Asien"
      title={t('destinations.asien.title')}
      subtitle={t('destinations.asien.subtitle')}
      destinations={destinations}
      slug="asien"
    />
  )
}

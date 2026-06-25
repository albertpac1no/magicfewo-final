import Image from 'next/image'
import { MapPin, Star } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export interface Destination {
  id: number
  image: string
  title: string
  country: string
  description: string
  rating: number
  price: string
  duration: string
}

interface DestinationPageProps {
  heroImage: string
  heroAlt: string
  title: string
  subtitle: string
  destinations: Destination[]
  slug: string
}

export async function DestinationPage({ heroImage, heroAlt, title, subtitle, destinations, slug }: DestinationPageProps) {
  const t = await getTranslations('common')

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <Image src={heroImage} alt={heroAlt} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <Breadcrumbs items={[
          { label: title, href: `/reiseziele/${slug}` },
        ]} />
        <h2 className="text-2xl font-bold text-secondary mb-8">{t('popularDestinations')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={destination.image}
                  alt={destination.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-secondary group-hover:text-primary transition-colors">
                      {destination.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {destination.country}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{destination.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{destination.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-gray-500 text-sm">{t('from')}</span>
                    <span className="text-primary font-bold text-2xl ml-1">{destination.price} €</span>
                    <span className="text-gray-500 text-sm ml-1">/ {destination.duration}</span>
                  </div>
                  <Link href="/properties" className="btn-primary">
                    {t('bookNow')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getTranslations } from 'next-intl/server'
import { MapPin, Star, Users } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const [t, tm] = await Promise.all([
    getTranslations({ locale, namespace: 'footer' }),
    getTranslations({ locale, namespace: 'meta' }),
  ])
  const title = `${t('pages.hotelbuchung')} | Gesino Reisen`
  const description = tm('footer.hotelbuchung.description')
  return { title, description, openGraph: { title, description, url: '/hotelbuchung' } }
}

// Demo data intentionally kept in German as per scope decision
const hotels = [
  {
    id: 1,
    name: 'Grand Plaza Hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    location: 'Berlin',
    rating: 4.8,
    reviews: 234,
    price: '199',
    description: 'Luxuriöses 5-Sterne Hotel im Herzen Berlins mit Blick auf die Stadt.',
    amenities: ['WLAN', 'Restaurant', 'Parkplatz', 'Spa'],
  },
  {
    id: 2,
    name: 'Seaside Resort',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
    location: 'Hamburg',
    rating: 4.6,
    reviews: 186,
    price: '159',
    description: 'Modernes Hotel direkt an der Elbe mit maritimem Flair.',
    amenities: ['WLAN', 'Pool', 'Restaurant', 'Fitness'],
  },
  {
    id: 3,
    name: 'Mountain View Lodge',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
    location: 'München',
    rating: 4.7,
    reviews: 158,
    price: '179',
    description: 'Gemütliches Hotel mit Alpenblick und traditionellem Charme.',
    amenities: ['WLAN', 'Restaurant', 'Sauna', 'Parkplatz'],
  },
]

const BENEFIT_ICONS = [Star, Users, MapPin]

export default async function HotelbuchungPage() {
  const [tF, tP] = await Promise.all([
    getTranslations('footer'),
    getTranslations('pages'),
  ])

  type Benefit = { title: string; text: string }
  const benefits = tP.raw('hotelbuchung.benefits') as Benefit[]
  const guestsOptions = tP.raw('hotelbuchung.search.guestsOptions') as string[]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: tF('pages.hotelbuchung'), href: '/hotelbuchung' }]} />
        <h1 className="text-4xl font-bold text-secondary mb-4">{tF('pages.hotelbuchung')}</h1>
        <p className="text-gray-custom mb-12 max-w-2xl">{tP('hotelbuchung.intro')}</p>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{tP('hotelbuchung.search.destination')}</label>
              <input type="text" placeholder={tP('hotelbuchung.search.destinationPlaceholder')} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{tP('hotelbuchung.search.checkIn')}</label>
              <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{tP('hotelbuchung.search.checkOut')}</label>
              <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{tP('hotelbuchung.search.guests')}</label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                {guestsOptions.map((opt) => <option key={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button className="btn-primary px-8">{tP('hotelbuchung.search.searchBtn')}</button>
          </div>
        </div>

        {/* Hotels List */}
        <div className="space-y-8">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="relative overflow-hidden min-h-[250px]">
                  <Image src={hotel.image} alt={hotel.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-6 md:col-span-2">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-secondary group-hover:text-primary transition-colors">{hotel.name}</h2>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {hotel.location}
                      </div>
                    </div>
                    <div className="flex items-center bg-primary/10 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{hotel.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({hotel.reviews})</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{hotel.description}</p>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {hotel.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-600">
                        {amenity}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-gray-500 text-sm">{tP('hotelbuchung.priceFrom')}</div>
                      <div className="text-primary font-bold text-2xl">{hotel.price} €</div>
                    </div>
                    <button className="btn-primary">{tP('hotelbuchung.bookRoom')}</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-secondary mb-4">{tP('relatedTopics')}</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/properties" className="text-sm text-primary hover:underline">{tP('hotelbuchung.related.properties')}</Link>
            <span className="text-gray-300">|</span>
            <Link href="/angebote" className="text-sm text-primary hover:underline">{tP('hotelbuchung.related.offers')}</Link>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((item, idx) => {
            const Icon = BENEFIT_ICONS[idx]
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-secondary mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

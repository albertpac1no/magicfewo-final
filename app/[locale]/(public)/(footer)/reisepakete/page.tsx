import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getTranslations } from 'next-intl/server'
import { Users, Calendar, Star } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const [t, tm] = await Promise.all([
    getTranslations({ locale, namespace: 'footer' }),
    getTranslations({ locale, namespace: 'meta' }),
  ])
  const title = `${t('pages.reisepakete')} | Gesino Reisen`
  const description = tm('footer.reisepakete.description')
  return { title, description, openGraph: { title, description, url: '/reisepakete' } }
}

// Demo data intentionally kept in German as per scope decision
const packages = [
  {
    id: 1,
    title: 'Thailand Rundreise Deluxe',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a',
    description: 'Entdecken Sie die Schönheit Thailands mit dieser 14-tägigen Luxus-Rundreise durch Bangkok, Chiang Mai und die Inseln.',
    duration: '14 Tage',
    groupSize: '2-12',
    price: '2499',
    rating: 4.8,
    reviews: 156,
    highlights: ['Tempeltour in Bangkok', 'Elefantenreservat in Chiang Mai', 'Inselhüpfen in der Andamanensee', 'Luxusunterkünfte'],
  },
  {
    id: 2,
    title: 'Italienische Träume',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963',
    description: 'Eine kulinarische und kulturelle Reise durch Rom, Florenz und Venedig mit exklusiven Führungen und Verkostungen.',
    duration: '10 Tage',
    groupSize: '2-8',
    price: '1899',
    rating: 4.9,
    reviews: 124,
    highlights: ['Private Kolosseum-Führung', 'Weinverkostung in der Toskana', 'Gondelfahrt in Venedig', 'Kochkurs in Florenz'],
  },
  {
    id: 3,
    title: 'Safari Abenteuer',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801',
    description: 'Erleben Sie die Big Five hautnah auf dieser unvergesslichen Safari-Tour durch Tansania und Kenia.',
    duration: '12 Tage',
    groupSize: '4-10',
    price: '3299',
    rating: 4.9,
    reviews: 98,
    highlights: ['Serengeti Nationalpark', 'Ngorongoro Krater', 'Masai Mara', 'Luxus-Zeltcamps'],
  },
]

export default async function ReisepaketePage() {
  const [tF, tP] = await Promise.all([
    getTranslations('footer'),
    getTranslations('pages'),
  ])

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: tF('pages.reisepakete'), href: '/reisepakete' }]} />
        <h1 className="text-4xl font-bold text-secondary mb-4">{tF('pages.reisepakete')}</h1>
        <p className="text-gray-custom mb-12 max-w-2xl">{tP('reisepakete.intro')}</p>

        <div className="grid grid-cols-1 gap-8">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative overflow-hidden min-h-[300px]">
                  <Image src={pkg.image} alt={pkg.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">{tP('reisepakete.bestseller')}</div>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-secondary group-hover:text-primary transition-colors mb-2">{pkg.title}</h2>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-primary mr-2" />
                      <span className="text-gray-600">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-primary mr-2" />
                      <span className="text-gray-600">{pkg.groupSize} {tP('reisepakete.persons')}</span>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(pkg.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">({pkg.reviews} {tP('reisepakete.reviews')})</span>
                  </div>

                  <p className="text-gray-600 mb-6">{pkg.description}</p>

                  <div className="space-y-2 mb-6">
                    <h3 className="font-semibold text-secondary">{tP('reisepakete.highlights')}</h3>
                    <ul className="grid grid-cols-2 gap-2">
                      {pkg.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-gray-500 text-sm">{tP('reisepakete.from')}</span>
                      <span className="text-primary font-bold text-3xl ml-2">{pkg.price} €</span>
                      <span className="text-gray-500 text-sm ml-1">{tP('reisepakete.perPerson')}</span>
                    </div>
                    <button className="btn-primary">{tP('reisepakete.bookNow')}</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-secondary mb-4">{tP('relatedTopics')}</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/properties" className="text-sm text-primary hover:underline">{tP('reisepakete.related.properties')}</Link>
            <span className="text-gray-300">|</span>
            <Link href="/angebote" className="text-sm text-primary hover:underline">{tP('reisepakete.related.offers')}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

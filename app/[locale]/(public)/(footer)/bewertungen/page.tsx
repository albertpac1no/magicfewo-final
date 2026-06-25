import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Star, ThumbsUp, MessageCircle } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const [t, tm] = await Promise.all([
    getTranslations({ locale, namespace: 'footer' }),
    getTranslations({ locale, namespace: 'meta' }),
  ])
  const title = `${t('pages.bewertungen')} | MagicFewo`
  const description = tm('footer.bewertungen.description')
  return { title, description, openGraph: { title, description, url: '/bewertungen' } }
}

const reviews = [
  {
    id: 1,
    name: 'Julia Schmidt',
    location: 'Berlin',
    rating: 5,
    date: '15. März 2024',
    title: 'Perfekter Urlaub in Thailand',
    comment: 'Die Buchung über MagicFewo war unkompliziert und professionell. Der Kundenservice war ausgezeichnet und hat uns bei allen Fragen unterstützt.',
    helpful: 24,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  },
  {
    id: 2,
    name: 'Thomas Weber',
    location: 'München',
    rating: 5,
    date: '12. März 2024',
    title: 'Traumhafte Malediven',
    comment: 'Ein unvergesslicher Urlaub! Die Unterkunft war genau wie beschrieben und der Service vor Ort war hervorragend. Werden definitiv wieder buchen!',
    helpful: 18,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
  },
  {
    id: 3,
    name: 'Sarah Müller',
    location: 'Hamburg',
    rating: 4,
    date: '10. März 2024',
    title: 'Schöner Städtetrip nach Paris',
    comment: 'Tolle Organisation und super Hotel in zentraler Lage. Einziger kleiner Kritikpunkt war der Transfer vom Flughafen, der etwas verspätet war.',
    helpful: 15,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
  },
]

export default async function BewertungenPage() {
  const t = await getTranslations('footer')
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Bewertungen', href: '/bewertungen' }]} />
        <h1 className="text-4xl font-bold text-secondary mb-4">{t('pages.bewertungen')}</h1>
        <p className="text-gray-custom mb-12 max-w-2xl">
          Erfahren Sie, was unsere Kunden über ihre Reisen mit MagicFewo berichten.
          Authentische Bewertungen helfen Ihnen bei Ihrer Entscheidung.
        </p>

        <div className="grid grid-cols-1 gap-8 mb-16">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-start gap-4">
                <Image
                  src={review.image}
                  alt={review.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="font-semibold text-secondary">{review.name}</h2>
                      <p className="text-sm text-gray-custom">{review.location}</p>
                    </div>
                    <span className="text-sm text-gray-custom">{review.date}</span>
                  </div>

                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>

                  <h3 className="font-semibold text-secondary mb-2">{review.title}</h3>
                  <p className="text-gray-custom mb-4">{review.comment}</p>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center text-sm text-gray-custom">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {review.helpful} fanden dies hilfreich
                    </span>
                    <span className="flex items-center text-sm text-gray-custom">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Kommentieren
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-secondary mb-4">Teilen Sie Ihre Erfahrungen</h2>
          <p className="text-gray-custom mb-6">
            Waren Sie mit MagicFewo auf Reisen? Wir freuen uns über Ihr Feedback!
          </p>
          <button className="btn-primary">Bewertung schreiben</button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-secondary mb-4">Verwandte Themen</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/properties" className="text-sm text-primary hover:underline">Unterkünfte</Link>
            <span className="text-gray-300">|</span>
            <Link href="/buchungsprozess" className="text-sm text-primary hover:underline">Buchungsprozess</Link>
            <span className="text-gray-300">|</span>
            <Link href="/faq" className="text-sm text-primary hover:underline">FAQ</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

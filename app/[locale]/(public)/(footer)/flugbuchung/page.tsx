import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getTranslations } from 'next-intl/server'
import { Plane, Calendar, Users, Clock } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const [t, tm] = await Promise.all([
    getTranslations({ locale, namespace: 'footer' }),
    getTranslations({ locale, namespace: 'meta' }),
  ])
  const title = `${t('pages.flugbuchung')} | MagicFewo`
  const description = tm('footer.flugbuchung.description')
  return { title, description, openGraph: { title, description, url: '/flugbuchung' } }
}

const flights = [
  {
    id: 1, airline: 'Lufthansa', flightNumber: 'LH 123',
    departure: { city: 'Berlin', airport: 'BER', time: '07:30' },
    arrival: { city: 'London', airport: 'LHR', time: '09:15' },
    duration: '1h 45m', price: '199', amenities: ['WLAN', 'Mahlzeit', 'Entertainment'], stops: 0, seatsAvailable: 12,
  },
  {
    id: 2, airline: 'Air France', flightNumber: 'AF 456',
    departure: { city: 'München', airport: 'MUC', time: '10:45' },
    arrival: { city: 'Paris', airport: 'CDG', time: '12:20' },
    duration: '1h 35m', price: '179', amenities: ['WLAN', 'Snack', 'Entertainment'], stops: 0, seatsAvailable: 8,
  },
  {
    id: 3, airline: 'KLM', flightNumber: 'KL 789',
    departure: { city: 'Hamburg', airport: 'HAM', time: '14:15' },
    arrival: { city: 'Amsterdam', airport: 'AMS', time: '15:35' },
    duration: '1h 20m', price: '159', amenities: ['WLAN', 'Getränke', 'Entertainment'], stops: 0, seatsAvailable: 15,
  },
]

export default async function FlugbuchungPage() {
  const t = await getTranslations('footer')
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Flugbuchung', href: '/flugbuchung' }]} />
        <h1 className="text-4xl font-bold text-secondary mb-4">{t('pages.flugbuchung')}</h1>
        <p className="text-gray-custom mb-12 max-w-2xl">
          Finden Sie die besten Flugverbindungen zu Ihrem Reiseziel.
          Wir bieten eine große Auswahl an Flügen von renommierten Airlines.
        </p>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Von</label>
                <input type="text" placeholder="Abflughafen" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nach</label>
                <input type="text" placeholder="Zielflughafen" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hinflug</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rückflug</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passagiere</label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <option>1 Erwachsener</option>
                <option>2 Erwachsene</option>
                <option>2 Erwachsene, 1 Kind</option>
                <option>2 Erwachsene, 2 Kinder</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button className="btn-primary px-8">Flüge suchen</button>
          </div>
        </div>

        {/* Flights List */}
        <div className="space-y-6">
          {flights.map((flight) => (
            <div key={flight.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    <Plane className="w-6 h-6 text-primary mr-3" />
                    <div>
                      <h3 className="font-semibold text-secondary">{flight.airline}</h3>
                      <p className="text-sm text-gray-500">Flugnummer: {flight.flightNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-primary bg-primary/5 px-3 py-1 rounded-full">
                    {flight.seatsAvailable} Plätze verfügbar
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Abflug</div>
                    <div className="text-xl font-semibold text-secondary">{flight.departure.time}</div>
                    <div className="text-gray-600">{flight.departure.city}</div>
                    <div className="text-sm text-gray-500">{flight.departure.airport}</div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-sm text-gray-500 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {flight.duration}
                    </div>
                    <div className="relative w-full h-3">
                      <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-200" />
                      <div className="absolute top-1/2 left-0 w-3 h-3 -mt-1.5 bg-primary rounded-full" />
                      <div className="absolute top-1/2 right-0 w-3 h-3 -mt-1.5 bg-primary rounded-full" />
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {flight.stops === 0 ? 'Direktflug' : `${flight.stops} Stopp${flight.stops > 1 ? 's' : ''}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Ankunft</div>
                    <div className="text-xl font-semibold text-secondary">{flight.arrival.time}</div>
                    <div className="text-gray-600">{flight.arrival.city}</div>
                    <div className="text-sm text-gray-500">{flight.arrival.airport}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  {flight.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-600">
                      {amenity}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-gray-500 text-sm">Preis pro Person</div>
                    <div className="text-primary font-bold text-2xl">{flight.price} €</div>
                  </div>
                  <button className="btn-primary">Jetzt buchen</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-secondary mb-4">Verwandte Themen</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/reisepakete" className="text-sm text-primary hover:underline">Reisepakete</Link>
            <span className="text-gray-300">|</span>
            <Link href="/reiseversicherung" className="text-sm text-primary hover:underline">Reiseversicherung</Link>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Plane, title: 'Große Auswahl', text: 'Flüge von allen namhaften Airlines zu den besten Preisen.' },
            { icon: Calendar, title: 'Flexible Buchung', text: 'Kostenlose Umbuchung und Stornierung bei vielen Tarifen.' },
            { icon: Users, title: '24/7 Service', text: 'Persönliche Unterstützung rund um die Uhr.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-secondary mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

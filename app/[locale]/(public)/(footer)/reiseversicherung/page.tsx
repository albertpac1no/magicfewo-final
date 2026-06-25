import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getTranslations } from 'next-intl/server'
import { Shield, Heart, Globe, Clock, AlertCircle, Plane, MapPin, Umbrella } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const [t, tm] = await Promise.all([
    getTranslations({ locale, namespace: 'footer' }),
    getTranslations({ locale, namespace: 'meta' }),
  ])
  const title = `${t('pages.reiseversicherung')} | MagicFewo`
  const description = tm('footer.reiseversicherung.description')
  return { title, description, openGraph: { title, description, url: '/reiseversicherung' } }
}

const insuranceTypes = [
  {
    id: 1, title: 'Basis-Schutz', price: '29', description: 'Grundlegende Absicherung für Ihre Reise',
    coverage: ['Reiserücktrittsversicherung', 'Reiseabbruchversicherung', 'Reisegepäckversicherung', '24h Notfall-Service'],
    recommended: false,
  },
  {
    id: 2, title: 'Premium-Schutz', price: '49', description: 'Umfassender Schutz für sorgenfreies Reisen',
    coverage: ['Alle Leistungen des Basis-Schutzes', 'Auslands-Krankenversicherung', 'Such-, Rettungs- und Bergungskosten', 'Verspätungsschutz', 'Corona-Schutz'],
    recommended: true,
  },
  {
    id: 3, title: 'Business-Schutz', price: '79', description: 'Speziell für Geschäftsreisende',
    coverage: ['Alle Leistungen des Premium-Schutzes', 'Elektronik-Versicherung', 'Geschäftspapiere-Versicherung', 'Ersatzgeschäftsreise', 'Geschäftsausfall-Versicherung'],
    recommended: false,
  },
]

const benefits = [
  { icon: Shield, title: 'Umfassender Schutz', description: 'Weltweite Absicherung für alle Reisearten' },
  { icon: Heart, title: 'Gesundheitsschutz', description: 'Medizinische Versorgung weltweit' },
  { icon: Globe, title: 'Weltweite Gültigkeit', description: 'Versicherungsschutz in allen Ländern' },
  { icon: Clock, title: '24/7 Notfall-Service', description: 'Rund um die Uhr für Sie erreichbar' },
]

export default async function ReiseversicherungPage() {
  const t = await getTranslations('footer')
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Reiseversicherung', href: '/reiseversicherung' }]} />
        <h1 className="text-4xl font-bold text-secondary mb-4">{t('pages.reiseversicherung')}</h1>
        <p className="text-gray-custom mb-12 max-w-2xl">
          Sichern Sie Ihre Reise optimal ab. Mit unseren Versicherungspaketen
          reisen Sie sorgenfrei und sind bestens geschützt.
        </p>

        {/* Insurance Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {insuranceTypes.map((insurance) => (
            <div key={insurance.id} className={`bg-white rounded-2xl p-6 shadow-lg relative ${insurance.recommended ? 'ring-2 ring-primary' : ''}`}>
              {insurance.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">Empfohlen</div>
                </div>
              )}
              <h2 className="text-xl font-semibold text-secondary mb-2">{insurance.title}</h2>
              <p className="text-gray-custom mb-4">{insurance.description}</p>
              <div className="text-primary font-bold text-3xl mb-6">
                {insurance.price} €
                <span className="text-sm text-gray-500 font-normal"> / Reise</span>
              </div>
              <ul className="space-y-3 mb-8">
                {insurance.coverage.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Shield className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full ${insurance.recommended ? 'btn-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} py-2 rounded-full font-medium transition-colors`}>
                Jetzt abschließen
              </button>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <h2 className="text-2xl font-bold text-secondary mb-8">Ihre Vorteile</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-secondary mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-secondary mb-4">Verwandte Themen</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/reisepakete" className="text-sm text-primary hover:underline">Reisepakete</Link>
            <span className="text-gray-300">|</span>
            <Link href="/faq" className="text-sm text-primary hover:underline">FAQ</Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">Häufig gestellte Fragen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-secondary flex items-center mb-2">
                <AlertCircle className="w-5 h-5 text-primary mr-2" />
                Wann sollte ich eine Reiseversicherung abschließen?
              </h3>
              <p className="text-gray-600">
                Am besten direkt bei der Buchung Ihrer Reise, da der Versicherungsschutz
                sofort beginnt und Sie bei Stornierungen abgesichert sind.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-secondary flex items-center mb-2">
                <Plane className="w-5 h-5 text-primary mr-2" />
                Welche Reisearten sind versichert?
              </h3>
              <p className="text-gray-600">
                Unsere Versicherungen decken alle Reisearten ab: Pauschalreisen,
                Individual-reisen, Geschäftsreisen und mehr.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-secondary flex items-center mb-2">
                <MapPin className="w-5 h-5 text-primary mr-2" />
                Wo gilt der Versicherungsschutz?
              </h3>
              <p className="text-gray-600">
                Der Versicherungsschutz gilt weltweit in allen Ländern,
                ausgenommen sind nur Gebiete, für die eine Reisewarnung besteht.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-secondary flex items-center mb-2">
                <Umbrella className="w-5 h-5 text-primary mr-2" />
                Was ist bei Corona-Erkrankung?
              </h3>
              <p className="text-gray-600">
                Unsere Premium- und Business-Pakete beinhalten einen umfassenden
                Corona-Schutz für Stornierung und medizinische Versorgung.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
  const title = `${t('pages.reiseversicherung')} | Gesino Reisen`
  const description = tm('footer.reiseversicherung.description')
  return { title, description, openGraph: { title, description, url: '/reiseversicherung' } }
}

const BENEFIT_ICONS = [Shield, Heart, Globe, Clock]
const FAQ_ICONS = [AlertCircle, Plane, MapPin, Umbrella]

export default async function ReiseversicherungPage() {
  const [tF, tP] = await Promise.all([
    getTranslations('footer'),
    getTranslations('pages'),
  ])

  type Package = { title: string; price: string; description: string; coverage: string[] }
  type Benefit = { title: string; description: string }
  type FaqItem = { question: string; answer: string }

  const packages = tP.raw('reiseversicherung.packages') as Package[]
  const benefits = tP.raw('reiseversicherung.benefits') as Benefit[]
  const faqItems = tP.raw('reiseversicherung.faqItems') as FaqItem[]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: tF('pages.reiseversicherung'), href: '/reiseversicherung' }]} />
        <h1 className="text-4xl font-bold text-secondary mb-4">{tF('pages.reiseversicherung')}</h1>
        <p className="text-gray-custom mb-12 max-w-2xl">{tP('reiseversicherung.intro')}</p>

        {/* Insurance Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg, index) => (
            <div key={index} className={`bg-white rounded-2xl p-6 shadow-lg relative ${index === 1 ? 'ring-2 ring-primary' : ''}`}>
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    {tP('reiseversicherung.recommended')}
                  </div>
                </div>
              )}
              <h2 className="text-xl font-semibold text-secondary mb-2">{pkg.title}</h2>
              <p className="text-gray-custom mb-4">{pkg.description}</p>
              <div className="text-primary font-bold text-3xl mb-6">
                {pkg.price} €
                <span className="text-sm text-gray-500 font-normal"> {tP('reiseversicherung.perTrip')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {pkg.coverage.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Shield className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full ${index === 1 ? 'btn-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} py-2 rounded-full font-medium transition-colors`}>
                {tP('reiseversicherung.cta')}
              </button>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <h2 className="text-2xl font-bold text-secondary mb-8">{tP('reiseversicherung.advantagesTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = BENEFIT_ICONS[index]
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-secondary mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-secondary mb-4">{tP('relatedTopics')}</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/reisepakete" className="text-sm text-primary hover:underline">{tP('reiseversicherung.related.travelPackages')}</Link>
            <span className="text-gray-300">|</span>
            <Link href="/faq" className="text-sm text-primary hover:underline">{tP('reiseversicherung.related.faq')}</Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-6">{tP('reiseversicherung.faqTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqItems.map((item, index) => {
              const Icon = FAQ_ICONS[index]
              return (
                <div key={index}>
                  <h3 className="font-semibold text-secondary flex items-center mb-2">
                    <Icon className="w-5 h-5 text-primary mr-2" />
                    {item.question}
                  </h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

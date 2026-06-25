import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getTranslations } from 'next-intl/server'
import { CheckCircle } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const [t, tm] = await Promise.all([
    getTranslations({ locale, namespace: 'footer' }),
    getTranslations({ locale, namespace: 'meta' }),
  ])
  const title = `${t('pages.buchungsprozess')} | Gesino Reisen`
  const description = tm('footer.buchungsprozess.description')
  return { title, description, openGraph: { title, description, url: '/buchungsprozess' } }
}

export default async function BuchungsprozessPage() {
  const [tF, tP] = await Promise.all([
    getTranslations('footer'),
    getTranslations('pages'),
  ])

  type Step = { title: string; description: string }
  const steps = tP.raw('buchungsprozess.steps') as Step[]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: tF('pages.buchungsprozess'), href: '/buchungsprozess' }]} />
        <h1 className="text-4xl font-bold text-secondary mb-4">{tF('pages.buchungsprozess')}</h1>
        <p className="text-gray-custom mb-12 max-w-2xl">{tP('buchungsprozess.intro')}</p>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-2">
                  {index + 1}. {step.title}
                </h2>
                <p className="text-gray-custom">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-secondary mb-4">{tP('relatedTopics')}</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/properties" className="text-sm text-primary hover:underline">{tP('buchungsprozess.related.properties')}</Link>
            <span className="text-gray-300">|</span>
            <Link href="/zahlungsmethoden" className="text-sm text-primary hover:underline">{tP('buchungsprozess.related.paymentMethods')}</Link>
            <span className="text-gray-300">|</span>
            <Link href="/faq" className="text-sm text-primary hover:underline">{tP('buchungsprozess.related.faq')}</Link>
          </div>
        </div>

        <div className="mt-12 bg-primary/5 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-secondary mb-4">{tP('buchungsprozess.contactTitle')}</h2>
          <p className="text-gray-custom mb-6">{tP('buchungsprozess.contactText')}</p>
          <Link href="/kontakt" className="btn-primary">{tP('buchungsprozess.contactCta')}</Link>
        </div>
      </div>
    </div>
  )
}

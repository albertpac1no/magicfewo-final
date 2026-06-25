import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { FileText, Scale, Shield, AlertCircle } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const [t, tm] = await Promise.all([
    getTranslations({ locale, namespace: 'footer' }),
    getTranslations({ locale, namespace: 'meta' }),
  ])
  const title = `${t('pages.agb')} | Gesino Reisen`
  const description = tm('footer.agb.description')
  return { title, description, openGraph: { title, description, url: '/agb' } }
}

const KEY_POINT_ICONS = [FileText, Scale, Shield]

export default async function AGBPage() {
  const [tF, tP] = await Promise.all([
    getTranslations('footer'),
    getTranslations('pages'),
  ])
  type KeyPoint = { title: string; text: string }
  type SubSection = { title: string; content: string }
  type Section = { title: string; content?: string; subsections?: SubSection[] }

  const keyPoints = tP.raw('agb.keyPoints') as KeyPoint[]
  const sections = tP.raw('agb.sections') as Section[]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: tF('pages.agb'), href: '/agb' }]} />
        <h1 className="text-4xl font-bold text-secondary mb-4">{tF('pages.agb')}</h1>
        <p className="text-gray-custom mb-12 max-w-2xl">
          {tP('agb.intro')}
        </p>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {keyPoints.map((point, idx) => {
            const Icon = KEY_POINT_ICONS[idx]
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-semibold text-secondary mb-2">{point.title}</h2>
                <p className="text-gray-600 text-sm">{point.text}</p>
              </div>
            )
          })}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-xl font-semibold text-secondary mb-4">{section.title}</h2>
              {section.content && <p className="text-gray-600 mb-4">{section.content}</p>}
              {section.subsections && (
                <div className="space-y-4 ml-4">
                  {section.subsections.map((sub, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-secondary mb-2">{sub.title}</h3>
                      <p className="text-gray-600">{sub.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-primary/5 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-2">{tP('agb.contactTitle')}</h2>
              <p className="text-gray-custom mb-6">{tP('agb.contactText')}</p>
              <Link href="/kontakt" className="btn-primary">{tP('contactCta')}</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-secondary mb-4">{tP('relatedTopics')}</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/datenschutz" className="text-sm text-primary hover:underline">{tP('agb.related.privacy')}</Link>
            <span className="text-gray-300">|</span>
            <Link href="/buchungsprozess" className="text-sm text-primary hover:underline">{tP('agb.related.bookingProcess')}</Link>
            <span className="text-gray-300">|</span>
            <Link href="/faq" className="text-sm text-primary hover:underline">{tP('agb.related.faq')}</Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          {tP('agb.footnote')}
        </div>
      </div>
    </div>
  )
}

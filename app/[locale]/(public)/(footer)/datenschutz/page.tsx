import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Shield, Lock, Eye, FileText } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const [t, tm] = await Promise.all([
    getTranslations({ locale, namespace: 'footer' }),
    getTranslations({ locale, namespace: 'meta' }),
  ])
  const title = `${t('pages.datenschutz')} | Gesino Reisen`
  const description = tm('footer.datenschutz.description')
  return { title, description, openGraph: { title, description, url: '/datenschutz' } }
}

const KEY_POINT_ICONS = [Shield, Lock, Eye, FileText]

export default async function DatenschutzPage() {
  const [tF, tP] = await Promise.all([
    getTranslations('footer'),
    getTranslations('pages'),
  ])

  type KeyPoint = { title: string; text: string }
  type Section = { title: string; content?: string; list?: string[] }

  const keyPoints = tP.raw('datenschutz.keyPoints') as KeyPoint[]
  const sections = tP.raw('datenschutz.sections') as Section[]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: tF('pages.datenschutz'), href: '/datenschutz' }]} />
        <h1 className="text-4xl font-bold text-secondary mb-4">{tF('pages.datenschutz')}</h1>
        <p className="text-gray-custom mb-12 max-w-2xl">{tP('datenschutz.intro')}</p>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {keyPoints.map((item, idx) => {
            const Icon = KEY_POINT_ICONS[idx]
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-semibold text-secondary mb-2">{item.title}</h2>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            )
          })}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-xl font-semibold text-secondary mb-4">{section.title}</h2>
              {section.content && <p className="text-gray-600 whitespace-pre-line">{section.content}</p>}
              {section.list && (
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-primary/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-secondary mb-4">{tP('datenschutz.contactTitle')}</h2>
          <p className="text-gray-custom mb-6">{tP('datenschutz.contactText')}</p>
          <Link href="/kontakt" className="btn-primary">{tP('contactCta')}</Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-secondary mb-4">{tP('relatedTopics')}</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/agb" className="text-sm text-primary hover:underline">{tP('datenschutz.related.terms')}</Link>
            <span className="text-gray-300">|</span>
            <Link href="/faq" className="text-sm text-primary hover:underline">{tP('datenschutz.related.faq')}</Link>
            <span className="text-gray-300">|</span>
            <Link href="/kontakt" className="text-sm text-primary hover:underline">{tP('datenschutz.related.contact')}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

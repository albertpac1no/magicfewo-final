import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { FAQContent } from './FAQContent'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { faqPageJsonLd } from '@/lib/structured-data'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const [t, tm] = await Promise.all([
    getTranslations({ locale, namespace: 'footer' }),
    getTranslations({ locale, namespace: 'meta' }),
  ])
  const title = `${t('pages.faq')} | Gesino Reisen`
  const description = tm('footer.faq.description')
  return { title, description, openGraph: { title, description, url: '/faq' } }
}

export default async function FAQPage() {
  const [tF, tP] = await Promise.all([
    getTranslations('footer'),
    getTranslations('pages'),
  ])

  type FaqCategory = { category: string; questions: { q: string; a: string }[] }
  const categories = tP.raw('faq.categories') as FaqCategory[]

  const allFaqs = categories.flatMap((cat) =>
    cat.questions.map((item) => ({ q: item.q, a: item.a }))
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(allFaqs)) }}
      />
      <div className="container mx-auto px-4 pt-8">
        <Breadcrumbs items={[{ label: tF('pages.faq'), href: '/faq' }]} />
      </div>
      <FAQContent categories={categories} />
      <div className="container mx-auto px-4 pb-8">
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-secondary mb-4">{tP('relatedTopics')}</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/buchungsprozess" className="text-sm text-primary hover:underline">{tP('faq.related.bookingProcess')}</Link>
            <span className="text-gray-300">|</span>
            <Link href="/zahlungsmethoden" className="text-sm text-primary hover:underline">{tP('faq.related.paymentMethods')}</Link>
            <span className="text-gray-300">|</span>
            <Link href="/reiseversicherung" className="text-sm text-primary hover:underline">{tP('faq.related.travelInsurance')}</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agb" className="text-sm text-primary hover:underline">{tP('faq.related.terms')}</Link>
          </div>
        </div>
      </div>
    </>
  )
}

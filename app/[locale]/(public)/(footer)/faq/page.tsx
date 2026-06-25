import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { FAQContent } from './FAQContent'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { faqPageJsonLd } from '@/lib/structured-data'

const allFaqs = [
  { q: 'Wie kann ich eine Reise buchen?', a: 'Sie können Ihre Reise einfach online über unsere Website buchen. Wählen Sie Ihr gewünschtes Reiseziel, prüfen Sie die Verfügbarkeit und folgen Sie dem Buchungsprozess.' },
  { q: 'Kann ich meine Buchung stornieren?', a: 'Ja, Buchungen können unter Berücksichtigung unserer Stornierungsbedingungen storniert werden. Die genauen Bedingungen finden Sie in Ihren Buchungsunterlagen.' },
  { q: 'Welche Zahlungsmethoden werden akzeptiert?', a: 'Wir akzeptieren Kreditkarten (Visa, Mastercard, American Express), PayPal und Banküberweisung.' },
  { q: 'Wann muss ich die Reise bezahlen?', a: 'Bei Buchung ist eine Anzahlung von 20% des Reisepreises fällig. Der Restbetrag muss spätestens 30 Tage vor Reiseantritt bezahlt werden.' },
  { q: 'Was ist im Reisepreis enthalten?', a: 'Der genaue Leistungsumfang variiert je nach Angebot und ist in der jeweiligen Reisebeschreibung aufgeführt. Grundsätzlich sind Unterkunft und aufgeführte Aktivitäten inklusive.' },
  { q: 'Brauche ich eine Reiseversicherung?', a: 'Wir empfehlen den Abschluss einer Reiseversicherung. Diese kann optional bei der Buchung hinzugefügt werden.' },
]

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const [t, tm] = await Promise.all([
    getTranslations({ locale, namespace: 'footer' }),
    getTranslations({ locale, namespace: 'meta' }),
  ])
  const title = `${t('pages.faq')} | MagicFewo`
  const description = tm('footer.faq.description')
  return { title, description, openGraph: { title, description, url: '/faq' } }
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(allFaqs)) }}
      />
      <div className="container mx-auto px-4 pt-8">
        <Breadcrumbs items={[{ label: 'FAQ', href: '/faq' }]} />
      </div>
      <FAQContent />
      <div className="container mx-auto px-4 pb-8">
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-secondary mb-4">Verwandte Themen</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/buchungsprozess" className="text-sm text-primary hover:underline">Buchungsprozess</Link>
            <span className="text-gray-300">|</span>
            <Link href="/zahlungsmethoden" className="text-sm text-primary hover:underline">Zahlungsmethoden</Link>
            <span className="text-gray-300">|</span>
            <Link href="/reiseversicherung" className="text-sm text-primary hover:underline">Reiseversicherung</Link>
            <span className="text-gray-300">|</span>
            <Link href="/agb" className="text-sm text-primary hover:underline">AGB</Link>
          </div>
        </div>
      </div>
    </>
  )
}

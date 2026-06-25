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
  const title = `${t('pages.agb')} | MagicFewo`
  const description = tm('footer.agb.description')
  return { title, description, openGraph: { title, description, url: '/agb' } }
}

const sections = [
  {
    title: '1. Geltungsbereich',
    content: 'Diese Allgemeinen Geschäftsbedingungen gelten für alle Geschäftsbeziehungen zwischen MagicFewo GmbH (nachfolgend "MagicFewo") und unseren Kunden. Maßgeblich ist jeweils die zum Zeitpunkt des Vertragsschlusses gültige Fassung.',
  },
  {
    title: '2. Vertragsschluss',
    content: 'Der Vertrag kommt durch die Annahme der Buchung des Kunden durch MagicFewo zustande. Die Annahme erfolgt durch eine Buchungsbestätigung per E-Mail. Die bloße Bestätigung des Eingangs der Buchungsanfrage stellt noch keine Annahme dar.',
  },
  {
    title: '3. Leistungen',
    subsections: [
      { title: '3.1 Leistungsumfang', content: 'Der Umfang der vertraglichen Leistungen ergibt sich aus der Leistungsbeschreibung im Angebot und den Angaben in der Buchungsbestätigung.' },
      { title: '3.2 Leistungsänderungen', content: 'Änderungen oder Abweichungen einzelner Reiseleistungen von dem vereinbarten Inhalt des Vertrages, die nach Vertragsschluss notwendig werden, sind nur gestattet, soweit sie nicht erheblich sind und den Gesamtzuschnitt der gebuchten Reise nicht beeinträchtigen.' },
    ],
  },
  {
    title: '4. Preise und Zahlung',
    subsections: [
      { title: '4.1 Preise', content: 'Die angegebenen Preise sind Endpreise und enthalten die gesetzliche Mehrwertsteuer.' },
      { title: '4.2 Zahlungsbedingungen', content: 'Bei Vertragsabschluss ist eine Anzahlung in Höhe von 20% des Reisepreises zu leisten. Die Restzahlung ist 30 Tage vor Reisebeginn fällig.' },
    ],
  },
  {
    title: '5. Rücktritt und Stornierung',
    content: 'Der Kunde kann jederzeit vor Reisebeginn von der Reise zurücktreten. Der Rücktritt ist gegenüber MagicFewo zu erklären. Maßgeblich ist der Zugang der Rücktrittserklärung. Im Falle des Rücktritts kann MagicFewo eine angemessene Entschädigung verlangen.',
  },
  {
    title: '6. Haftung',
    content: 'MagicFewo haftet für die gewissenhafte Reisevorbereitung, die sorgfältige Auswahl und Überwachung der Leistungsträger und die ordnungsgemäße Erbringung der vertraglich vereinbarten Reiseleistungen.',
  },
]

export default async function AGBPage() {
  const t = await getTranslations('footer')
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: 'AGB', href: '/agb' }]} />
        <h1 className="text-4xl font-bold text-secondary mb-4">{t('pages.agb')}</h1>
        <p className="text-gray-custom mb-12 max-w-2xl">
          Diese AGB regeln die Geschäftsbeziehung zwischen MagicFewo und unseren Kunden.
          Bitte lesen Sie diese sorgfältig durch.
        </p>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-semibold text-secondary mb-2">Transparente Bedingungen</h2>
            <p className="text-gray-600 text-sm">Klare und verständliche Regelungen für alle Leistungen.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-semibold text-secondary mb-2">Faire Konditionen</h2>
            <p className="text-gray-600 text-sm">Ausgewogene Rechte und Pflichten für beide Seiten.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-semibold text-secondary mb-2">Rechtssicherheit</h2>
            <p className="text-gray-600 text-sm">Alle Regelungen entsprechen den gesetzlichen Vorgaben.</p>
          </div>
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
              <h2 className="text-2xl font-bold text-secondary mb-2">Haben Sie Fragen zu unseren AGB?</h2>
              <p className="text-gray-custom mb-6">
                Unser Kundenservice-Team steht Ihnen für Rückfragen zur Verfügung.
                Kontaktieren Sie uns gerne bei Unklarheiten oder spezifischen Fragen.
              </p>
              <Link href="/kontakt" className="btn-primary">Kontakt aufnehmen</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-secondary mb-4">Verwandte Themen</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/datenschutz" className="text-sm text-primary hover:underline">Datenschutz</Link>
            <span className="text-gray-300">|</span>
            <Link href="/buchungsprozess" className="text-sm text-primary hover:underline">Buchungsprozess</Link>
            <span className="text-gray-300">|</span>
            <Link href="/faq" className="text-sm text-primary hover:underline">FAQ</Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Stand: März 2024 • MagicFewo GmbH
        </div>
      </div>
    </div>
  )
}

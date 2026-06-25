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
  const title = `${t('pages.datenschutz')} | MagicFewo`
  const description = tm('footer.datenschutz.description')
  return { title, description, openGraph: { title, description, url: '/datenschutz' } }
}

const sections: { title: string; content?: string; list?: string[] }[] = [
  {
    title: 'Datenschutzerklärung',
    content: 'Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von personenbezogenen Daten innerhalb unseres Onlineangebotes auf. Im Hinblick auf die verwendeten Begrifflichkeiten, wie z.B. "Verarbeitung" oder "Verantwortlicher", verweisen wir auf die Definitionen im Art. 4 der Datenschutzgrundverordnung (DSGVO).',
  },
  {
    title: 'Verantwortlicher',
    content: 'MagicFewo GmbH\nReisestraße 123\n10115 Berlin\nDeutschland\n\nE-Mail: datenschutz@magicfewo.de\nTelefon: +49 123 456789',
  },
  {
    title: 'Arten der verarbeiteten Daten',
    list: [
      'Bestandsdaten (z.B. Namen, Adressen)',
      'Kontaktdaten (z.B. E-Mail, Telefonnummern)',
      'Inhaltsdaten (z.B. Texteingaben, Fotografien, Videos)',
      'Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten)',
      'Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen)',
    ],
  },
  {
    title: 'Zweck der Verarbeitung',
    list: [
      'Zurverfügungstellung des Onlineangebotes, seiner Funktionen und Inhalte',
      'Beantwortung von Kontaktanfragen und Kommunikation mit Nutzern',
      'Sicherheitsmaßnahmen',
      'Reichweitenmessung/Marketing',
    ],
  },
  {
    title: 'Cookies',
    content: 'Wir verwenden Cookies, um unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Cookies sind kleine Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert. Die meisten der von uns verwendeten Cookies sind so genannte "Session-Cookies". Sie werden nach Ende Ihres Besuchs automatisch gelöscht.',
  },
  {
    title: 'Ihre Rechte',
    list: [
      'Recht auf Auskunft über die Sie betreffenden personenbezogenen Daten',
      'Recht auf Berichtigung oder Löschung',
      'Recht auf Einschränkung der Verarbeitung',
      'Recht auf Widerspruch gegen die Verarbeitung',
      'Recht auf Datenübertragbarkeit',
    ],
  },
]

export default async function DatenschutzPage() {
  const t = await getTranslations('footer')
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Datenschutz', href: '/datenschutz' }]} />
        <h1 className="text-4xl font-bold text-secondary mb-4">{t('pages.datenschutz')}</h1>
        <p className="text-gray-custom mb-12 max-w-2xl">
          Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen.
          Hier erfahren Sie, wie wir mit Ihren Daten umgehen.
        </p>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Shield, title: 'Sicherer Schutz', text: 'Ihre Daten werden nach höchsten Sicherheitsstandards geschützt.' },
            { icon: Lock, title: 'SSL Verschlüsselung', text: 'Alle Daten werden verschlüsselt übertragen.' },
            { icon: Eye, title: 'Transparenz', text: 'Volle Kontrolle über Ihre persönlichen Daten.' },
            { icon: FileText, title: 'DSGVO konform', text: 'Entspricht allen Datenschutzrichtlinien.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-semibold text-secondary mb-2">{item.title}</h2>
              <p className="text-gray-600 text-sm">{item.text}</p>
            </div>
          ))}
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
          <h2 className="text-2xl font-bold text-secondary mb-4">Fragen zum Datenschutz?</h2>
          <p className="text-gray-custom mb-6">
            Unser Datenschutzbeauftragter steht Ihnen für alle Fragen zur Verfügung.
          </p>
          <Link href="/kontakt" className="btn-primary">Kontakt aufnehmen</Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-secondary mb-4">Verwandte Themen</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/agb" className="text-sm text-primary hover:underline">AGB</Link>
            <span className="text-gray-300">|</span>
            <Link href="/faq" className="text-sm text-primary hover:underline">FAQ</Link>
            <span className="text-gray-300">|</span>
            <Link href="/kontakt" className="text-sm text-primary hover:underline">Kontakt</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

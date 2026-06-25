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
  const title = `${t('pages.buchungsprozess')} | MagicFewo`
  const description = tm('footer.buchungsprozess.description')
  return { title, description, openGraph: { title, description, url: '/buchungsprozess' } }
}

const steps = [
  { title: 'Reiseziel auswählen', description: 'Wählen Sie aus unserer vielfältigen Auswahl an Reisezielen weltweit.' },
  { title: 'Verfügbarkeit prüfen', description: 'Geben Sie Ihre gewünschten Reisedaten ein und prüfen Sie die Verfügbarkeit.' },
  { title: 'Persönliche Daten', description: 'Füllen Sie das Buchungsformular mit Ihren persönlichen Daten aus.' },
  { title: 'Zahlungsabwicklung', description: 'Wählen Sie Ihre bevorzugte Zahlungsmethode und schließen Sie die Buchung ab.' },
  { title: 'Bestätigung', description: 'Erhalten Sie Ihre Buchungsbestätigung per E-Mail mit allen wichtigen Details.' },
]

export default async function BuchungsprozessPage() {
  const t = await getTranslations('footer')
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Buchungsprozess', href: '/buchungsprozess' }]} />
        <h1 className="text-4xl font-bold text-secondary mb-4">{t('pages.buchungsprozess')}</h1>
        <p className="text-gray-custom mb-12 max-w-2xl">
          Erfahren Sie, wie einfach es ist, Ihre nächste Reise mit MagicFewo zu buchen.
          Folgen Sie unserem übersichtlichen Buchungsprozess in nur wenigen Schritten.
        </p>

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
          <h2 className="text-lg font-semibold text-secondary mb-4">Verwandte Themen</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/properties" className="text-sm text-primary hover:underline">Unterkünfte durchsuchen</Link>
            <span className="text-gray-300">|</span>
            <Link href="/zahlungsmethoden" className="text-sm text-primary hover:underline">Zahlungsmethoden</Link>
            <span className="text-gray-300">|</span>
            <Link href="/faq" className="text-sm text-primary hover:underline">FAQ</Link>
          </div>
        </div>

        <div className="mt-12 bg-primary/5 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-secondary mb-4">Haben Sie Fragen zum Buchungsprozess?</h2>
          <p className="text-gray-custom mb-6">Unser Kundenservice-Team steht Ihnen jederzeit zur Verfügung.</p>
          <Link href="/kontakt" className="btn-primary">Kontaktieren Sie uns</Link>
        </div>
      </div>
    </div>
  )
}

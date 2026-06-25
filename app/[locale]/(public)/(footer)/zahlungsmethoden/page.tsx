import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getTranslations } from 'next-intl/server'
import { CreditCard, Wallet, Building2, ShieldCheck } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const [t, tm] = await Promise.all([
    getTranslations({ locale, namespace: 'footer' }),
    getTranslations({ locale, namespace: 'meta' }),
  ])
  const title = `${t('pages.zahlungsmethoden')} | MagicFewo`
  const description = tm('footer.zahlungsmethoden.description')
  return { title, description, openGraph: { title, description, url: '/zahlungsmethoden' } }
}

const paymentMethods = [
  {
    icon: CreditCard,
    title: 'Kreditkarte',
    description: 'Visa, Mastercard, American Express',
    benefits: ['Sofortige Bestätigung', 'Sichere Zahlung', 'Keine zusätzlichen Gebühren'],
  },
  {
    icon: Building2,
    title: 'Banküberweisung',
    description: 'Direkte Überweisung auf unser Bankkonto',
    benefits: ['Keine Kreditkarte erforderlich', 'Flexible Zahlungsfrist', 'Für große Beträge geeignet'],
  },
  {
    icon: Wallet,
    title: 'PayPal',
    description: 'Schnell und sicher mit PayPal bezahlen',
    benefits: ['Käuferschutz', 'Schnelle Abwicklung', 'Weltweite Akzeptanz'],
  },
]

export default async function ZahlungsmethodenPage() {
  const t = await getTranslations('footer')
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Zahlungsmethoden', href: '/zahlungsmethoden' }]} />
        <h1 className="text-4xl font-bold text-secondary mb-4">{t('pages.zahlungsmethoden')}</h1>
        <p className="text-gray-custom mb-12 max-w-2xl">
          Wir bieten Ihnen verschiedene sichere Zahlungsmöglichkeiten für Ihre Buchung.
          Wählen Sie die für Sie passende Methode.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {paymentMethods.map((method, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <method.icon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-secondary mb-2">{method.title}</h2>
              <p className="text-gray-custom mb-4">{method.description}</p>
              <ul className="space-y-2">
                {method.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-custom">
                    <ShieldCheck className="w-4 h-4 text-primary mr-2" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-secondary mb-4">Verwandte Themen</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/buchungsprozess" className="text-sm text-primary hover:underline">Buchungsprozess</Link>
            <span className="text-gray-300">|</span>
            <Link href="/faq" className="text-sm text-primary hover:underline">FAQ</Link>
          </div>
        </div>

        <div className="mt-12 bg-primary/5 rounded-2xl p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-secondary mb-4">Sicherheit hat höchste Priorität</h2>
            <p className="text-gray-custom mb-6">
              Alle Zahlungen werden über sichere SSL-verschlüsselte Verbindungen abgewickelt.
              Ihre Daten sind bei uns sicher.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

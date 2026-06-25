import type { Metadata } from 'next'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { getSettings } from '@/lib/settings'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('contact.title'),
    description: t('contact.description'),
    openGraph: {
      title: t('contact.title'),
      description: t('contact.description'),
      url: '/kontakt',
    },
  }
}

export default async function KontaktPage() {
  const settings = await getSettings()
  const t = await getTranslations('common')

  const contactInfo = [
    {
      icon: Phone,
      title: t('contact.phone'),
      details: [settings.company_phone],
      action: `tel:${settings.company_phone}`,
    },
    {
      icon: Mail,
      title: t('contact.email'),
      details: [settings.company_email],
      action: `mailto:${settings.company_email}`,
    },
    {
      icon: MapPin,
      title: t('contact.address'),
      details: [settings.company_address, `${settings.company_postal_code} ${settings.company_city}`],
      action: `https://maps.google.com/maps?q=${encodeURIComponent(`${settings.company_address}, ${settings.company_postal_code} ${settings.company_city}, ${settings.company_country}`)}`,
      external: true,
    },
    {
      icon: Clock,
      title: t('contact.hours'),
      details: ['Mo-Fr: 9:00 - 18:00', 'Sa: 10:00 - 14:00'],
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <Image
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a"
          alt="MagicFewo Kundenservice – Kontaktieren Sie unser Team"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">{t('contact.heroTitle')}</h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl">
              {t('contact.heroSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <Breadcrumbs items={[{ label: 'Kontakt', href: '/kontakt' }]} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-secondary mb-6">{t('contact.writeUs')}</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.firstName')}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Max"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.lastName')}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Mustermann"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.email')}</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="max@beispiel.de"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.subject')}</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder={t('contact.subjectPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.message')}</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder={t('contact.messagePlaceholder')}
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                {t('contact.send')}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-secondary mb-6">{t('contact.contactInfo')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary mb-2">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-600">{detail}</p>
                  ))}
                  {info.action && (
                    <a
                      href={info.action}
                      className="inline-block mt-3 text-primary font-medium hover:opacity-80 transition-colors"
                      target={info.external ? '_blank' : undefined}
                      rel={info.external ? 'noopener noreferrer' : undefined}
                    >
                      {t('contact.contactAction')}
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.654394942856!2d13.404954!3d52.520008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDMxJzEyLjAiTiAxM8KwMjQnMTcuOCJF!5e0!3m2!1sen!2sde!4v1635959876543!5m2!1sen!2sde"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Company Info */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">{t('contact.companyInfo')}</h3>
              <div className="space-y-2 text-gray-600">
                <p>{settings.company_name}</p>
                <p>Handelsregister: {settings.company_registration}</p>
                <p>USt-IdNr.: {settings.company_vat_id}</p>
                <p>Steuernummer: {settings.company_tax_id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

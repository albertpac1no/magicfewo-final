import type { Metadata } from 'next'
import Image from 'next/image'
import { Users, Award, Globe2, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { getSettings } from '@/lib/settings'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('about.title'),
    description: t('about.description'),
    openGraph: {
      title: t('about.title'),
      description: t('about.description'),
      url: '/ueber-uns',
    },
  }
}

const stats = [
  { icon: Users, label: 'Zufriedene Kunden', value: '50.000+' },
  { icon: Award, label: 'Jahre Erfahrung', value: '15+' },
  { icon: Globe2, label: 'Reiseziele', value: '100+' },
]

const team = [
  {
    name: 'Anna Schmidt',
    position: 'CEO & Gründerin',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    description: 'Mit über 20 Jahren Erfahrung in der Reisebranche leitet Anna unser Unternehmen mit Leidenschaft und Vision.',
  },
  {
    name: 'Michael Weber',
    position: 'Reiseberater',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    description: 'Michael ist unser Experte für außergewöhnliche Reiseerlebnisse und maßgeschneiderte Urlaubsplanung.',
  },
  {
    name: 'Laura Müller',
    position: 'Kundenservice',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    description: 'Laura sorgt dafür, dass unsere Kunden rundum betreut werden und ihre Reise reibungslos verläuft.',
  },
]

export default async function UeberUnsPage() {
  const settings = await getSettings()
  const t = await getTranslations('common')

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          alt="Das MagicFewo Team – Ihr Partner für Ferienwohnungen"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">{t('about.heroTitle', { name: settings.platform_name })}</h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl">
              {t('about.heroSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <Breadcrumbs items={[{ label: 'Über uns', href: '/ueber-uns' }]} />
        {/* Mission Statement */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary mb-6">{t('about.missionTitle')}</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            {t('about.missionText', { name: settings.platform_name })}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-secondary mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-secondary text-center mb-12">{t('about.teamTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-secondary group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <div className="text-primary font-medium mb-3">{member.position}</div>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-secondary mb-4">{t('about.questionsTitle')}</h2>
          <p className="text-gray-600 mb-6">{t('about.questionsText')}</p>
          <div className="flex items-center justify-center gap-4">
            <a href={`tel:${settings.company_phone}`} className="btn-primary flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              {settings.company_phone}
            </a>
          </div>
        </div>

        {/* Company Info */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-secondary mb-6">{t('about.companyInfoTitle')}</h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 mb-4">
              {settings.company_name}<br />
              {settings.company_address}<br />
              {settings.company_postal_code} {settings.company_city}
            </p>
            <p className="text-gray-600">
              Handelsregister: {settings.company_registration}<br />
              USt-IdNr.: {settings.company_vat_id}<br />
              Steuernummer: {settings.company_tax_id}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

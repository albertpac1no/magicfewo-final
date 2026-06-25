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

const STAT_ICONS = [Users, Award, Globe2]

export default async function UeberUnsPage() {
  const settings = await getSettings()
  const [tC, tP] = await Promise.all([
    getTranslations('common'),
    getTranslations('pages'),
  ])

  type Stat = { label: string; value: string }
  type TeamMember = { name: string; position: string; image: string; description: string }

  const stats = tP.raw('about.stats') as Stat[]
  const team = tP.raw('about.team') as TeamMember[]

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <Image
          src="/images/about-team-hero.jpg"
          alt={tP('about.heroAlt')}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">{tC('about.heroTitle', { name: settings.platform_name })}</h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl">
              {tC('about.heroSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <Breadcrumbs items={[{ label: tP('about.breadcrumb'), href: '/ueber-uns' }]} />

        {/* Mission Statement */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-secondary mb-6">{tC('about.missionTitle')}</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            {tC('about.missionText', { name: settings.platform_name })}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = STAT_ICONS[index]
            return (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-secondary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-secondary text-center mb-12">{tC('about.teamTitle')}</h2>
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
          <h2 className="text-2xl font-bold text-secondary mb-4">{tC('about.questionsTitle')}</h2>
          <p className="text-gray-600 mb-6">{tC('about.questionsText')}</p>
          <div className="flex items-center justify-center gap-4">
            <a href={`tel:${settings.company_phone}`} className="btn-primary flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              {settings.company_phone}
            </a>
          </div>
        </div>

        {/* Company Info */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-secondary mb-6">{tC('about.companyInfoTitle')}</h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 mb-4">
              {settings.company_name}<br />
              {settings.company_address}<br />
              {settings.company_postal_code} {settings.company_city}
            </p>
            <p className="text-gray-600">
              {tP('about.registration')}: {settings.company_registration}<br />
              {tP('about.vatId')}: {settings.company_vat_id}<br />
              {tP('about.taxId')}: {settings.company_tax_id}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

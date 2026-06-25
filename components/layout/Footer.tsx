import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { Phone, Mail, MapPin, Clock, Globe, CreditCard, Shield } from 'lucide-react'
import { getSettings } from '@/lib/settings'
import { Logo } from './Logo'
import type { SVGProps } from 'react'

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  )
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z" />
    </svg>
  )
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const socialLinks = [
  { icon: FacebookIcon, label: 'Facebook', url: '#' },
  { icon: InstagramIcon, label: 'Instagram', url: '#' },
  { icon: TwitterIcon, label: 'Twitter', url: '#' },
  { icon: YoutubeIcon, label: 'Youtube', url: '#' },
  { icon: LinkedinIcon, label: 'LinkedIn', url: '#' },
]

export async function Footer() {
  const [settings, t] = await Promise.all([
    getSettings(),
    getTranslations('footer'),
  ])
  const currentYear = new Date().getFullYear()

  const contactInfo = [
    { icon: Phone, label: settings?.company_phone || '+49 123 456789' },
    { icon: Mail, label: settings?.company_email || 'info@magicfewo.de' },
    {
      icon: MapPin,
      label: `${settings?.company_address || 'Ferienstraße 123'}, ${settings?.company_postal_code || '10115'} ${settings?.company_city || 'Berlin'}`,
    },
    { icon: Clock, label: t('businessHours') },
  ]

  const aboutLinks = [
    { label: t('links.bookingProcess'), path: '/buchungsprozess' },
    { label: t('links.paymentMethods'), path: '/zahlungsmethoden' },
    { label: t('links.reviews'), path: '/bewertungen' },
    { label: t('links.faq'), path: '/faq' },
  ]

  const serviceLinks = [
    { label: t('links.travelPackages'), path: '/reisepakete' },
    { label: t('links.hotelBooking'), path: '/hotelbuchung' },
    { label: t('links.flightBooking'), path: '/flugbuchung' },
    { label: t('links.travelInsurance'), path: '/reiseversicherung' },
  ]

  const companyLinks = [
    { label: t('links.aboutUs'), path: '/ueber-uns' },
    { label: t('links.contact'), path: '/kontakt' },
    { label: t('links.privacy'), path: '/datenschutz' },
    { label: t('links.terms'), path: '/agb' },
  ]

  const trustBadges = [
    { icon: Shield, label: t('trustBadges.secure') },
    { icon: CreditCard, label: t('trustBadges.securePayment') },
    { icon: Globe, label: t('trustBadges.worldwideService') },
  ]

  return (
    <footer className="bg-gray-50/50 border-t border-gray-100 pt-14 md:pt-20 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Company Info */}
          <div className="col-span-full md:col-span-4">
            <Logo
              className="mb-6"
              platformName={settings?.platform_name}
              logoLightUrl={settings?.logo_light_url}
              logoDarkUrl={settings?.logo_dark_url}
            />
            <p className="text-gray-custom mb-6 text-sm leading-relaxed">
              {t('companyDescription')}
            </p>

            {/* Contact Information */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center text-gray-custom">
                  <item.icon className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                  <span className="text-sm break-words">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-full md:col-span-2 space-y-6 md:space-y-0">
            <div className="space-y-4">
              <h4 className="font-semibold text-secondary">{t('sections.about')}</h4>
              <ul className="space-y-3">
                {aboutLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.path}
                      className="text-gray-custom hover:text-primary transition-colors text-sm block py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-span-full md:col-span-2 space-y-6 md:space-y-0">
            <div className="space-y-4">
              <h4 className="font-semibold text-secondary">{t('sections.services')}</h4>
              <ul className="space-y-3">
                {serviceLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.path}
                      className="text-gray-custom hover:text-primary transition-colors text-sm block py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-span-full md:col-span-2 space-y-6 md:space-y-0">
            <div className="space-y-4">
              <h4 className="font-semibold text-secondary">{t('sections.company')}</h4>
              <ul className="space-y-3">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.path}
                      className="text-gray-custom hover:text-primary transition-colors text-sm block py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-span-full md:col-span-2 space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-secondary">{t('sections.newsletter')}</h4>
              <div className="space-y-4">
                <p className="text-sm text-gray-custom">
                  {t('newsletter.text')}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder={t('newsletter.placeholder')}
                    className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg md:rounded-l-lg md:rounded-r-none focus:outline-none focus:border-primary"
                  />
                  <button className="bg-primary text-white px-4 py-2 rounded-lg md:rounded-r-lg md:rounded-l-none text-sm hover:bg-primary/90 transition-colors whitespace-nowrap">
                    {t('newsletter.subscribe')}
                  </button>
                </div>
              </div>
            </div>
            <button className="w-full bg-primary/10 text-primary px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors">
              {t('downloadApp')}
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8 border-t border-gray-200/60">
          {trustBadges.map((badge, index) => (
            <div key={index} className="flex items-center justify-center gap-2.5 py-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <badge.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-600">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="pt-6 md:pt-8 border-t border-gray-200/60">
          <div className="flex flex-col items-center space-y-4 md:space-y-0 md:flex-row md:justify-between">
            {/* Copyright */}
            <p className="text-gray-custom text-sm text-center md:text-left">
              {t('copyright', { year: currentYear, company: settings?.company_name || 'MagicFeWo GmbH' })}
            </p>

            {/* Social Links */}
            <div className="flex space-x-3 md:space-x-4 order-first md:order-none mb-4 md:mb-0">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="nofollow noopener"
                  className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-primary" />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
              <Link href="/datenschutz" className="text-gray-custom hover:text-primary text-sm">
                {t('links.privacy')}
              </Link>
              <Link href="/agb" className="text-gray-custom hover:text-primary text-sm">
                {t('links.terms')}
              </Link>
              <button className="text-gray-custom hover:text-primary text-sm">
                {t('cookieSettings')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

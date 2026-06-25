import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getSettings } from '@/lib/settings'
import { organizationJsonLd } from '@/lib/structured-data'
import { CookieBanner } from '@/components/layout/CookieBanner'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSettings()
  const t = await getTranslations({ locale, namespace: 'meta' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gesino-reisen.com'

  return {
    metadataBase: new URL(siteUrl),
    title: settings.page_title || t('home.title'),
    description: settings.meta_description || t('home.description'),
    icons: settings.favicon_url ? { icon: settings.favicon_url } : undefined,
    openGraph: {
      type: 'website',
      siteName: settings.platform_name || 'Gesino Reisen',
      locale: locale === 'de' ? 'de_DE' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: locale === 'de' ? siteUrl : `${siteUrl}/en`,
      languages: {
        de: siteUrl,
        en: `${siteUrl}/en`,
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const settings = await getSettings()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <style>{`
          :root {
            --color-primary: ${settings.primary_color || '#FF385C'};
            --color-secondary: ${settings.secondary_color || '#0A2463'};
          }
        `}</style>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(settings)) }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <CookieBanner />
        </NextIntlClientProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}

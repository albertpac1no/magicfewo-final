import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !hasLocale(routing.locales, locale)) {
    locale = routing.defaultLocale
  }

  const [common, nav, properties, booking, dashboard, admin, auth, footer, meta] =
    await Promise.all([
      import(`../messages/${locale}/common.json`),
      import(`../messages/${locale}/nav.json`),
      import(`../messages/${locale}/properties.json`),
      import(`../messages/${locale}/booking.json`),
      import(`../messages/${locale}/dashboard.json`),
      import(`../messages/${locale}/admin.json`),
      import(`../messages/${locale}/auth.json`),
      import(`../messages/${locale}/footer.json`),
      import(`../messages/${locale}/meta.json`),
    ])

  return {
    locale,
    messages: {
      common: common.default,
      nav: nav.default,
      properties: properties.default,
      booking: booking.default,
      dashboard: dashboard.default,
      admin: admin.default,
      auth: auth.default,
      footer: footer.default,
      meta: meta.default,
    },
  }
})

import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://magicfewo.de'

  const staticRoutes = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/properties', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/angebote', changeFrequency: 'daily' as const, priority: 0.8 },
    { path: '/kontakt', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/ueber-uns', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/reiseziele/europa', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/reiseziele/asien', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/reiseziele/amerika', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/reiseziele/afrika', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/faq', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/agb', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/datenschutz', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/buchungsprozess', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/zahlungsmethoden', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/bewertungen', changeFrequency: 'weekly' as const, priority: 0.6 },
    { path: '/hotelbuchung', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/flugbuchung', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/reisepakete', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/reiseversicherung', changeFrequency: 'monthly' as const, priority: 0.5 },
  ]

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: {
      languages: {
        de: `${siteUrl}${route.path}`,
        en: `${siteUrl}/en${route.path}`,
      },
    },
  }))

  let propertyEntries: MetadataRoute.Sitemap = []
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: properties } = await supabase
      .from('properties')
      .select('id, updated_at')
      .order('updated_at', { ascending: false })

    if (properties) {
      propertyEntries = properties.map((property) => ({
        url: `${siteUrl}/properties/${property.id}`,
        lastModified: new Date(property.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: {
          languages: {
            de: `${siteUrl}/properties/${property.id}`,
            en: `${siteUrl}/en/properties/${property.id}`,
          },
        },
      }))
    }
  } catch {
    // Sitemap generation should not fail the build
  }

  return [...staticEntries, ...propertyEntries]
}

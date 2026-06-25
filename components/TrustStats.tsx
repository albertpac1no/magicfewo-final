import { createSupabaseServer } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { Home, Globe2, Users, Clock } from 'lucide-react'

export async function TrustStats() {
  const t = await getTranslations('common')
  const supabase = await createSupabaseServer()

  const [{ count: propertyCount }, { count: bookingCount }] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    {
      icon: Home,
      value: propertyCount ? `${propertyCount.toLocaleString('de-DE')}+` : '500+',
      label: t('stats.propertiesWorldwide'),
    },
    {
      icon: Users,
      value: bookingCount ? `${(bookingCount * 3).toLocaleString('de-DE')}+` : '10.000+',
      label: t('stats.happyGuests'),
    },
    {
      icon: Globe2,
      value: '30+',
      label: t('stats.countries'),
    },
    {
      icon: Clock,
      value: '24/7',
      label: t('stats.customerService'),
    },
  ]

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary" />
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />

      <div className="relative container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-4">
                <Icon className="w-6 h-6 text-white/90" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{value}</div>
              <div className="text-white/60 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

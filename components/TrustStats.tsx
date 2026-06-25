import Image from 'next/image'
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
    <section className="relative py-20 overflow-hidden">
      {/* Background photo */}
      <Image
        src="/images/hero-villa-pool.jpg"
        alt=""
        fill
        aria-hidden="true"
        className="object-cover object-center"
        sizes="100vw"
      />
      {/* Overlay: dark brand wash + vignette for readable text */}
      <div className="absolute inset-0 bg-secondary/85" />
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/70 via-secondary/60 to-secondary/80" />

      <div className="relative container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm mb-4">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1 drop-shadow-sm">{value}</div>
              <div className="text-white/75 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { formatDate, formatPrice } from '@/lib/utils'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import {
  Calendar,
  Building2,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  MapPin,
  ArrowRight,
  CalendarDays,
  User,
  Settings,
  Clock,
} from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import type { Profile } from '@/lib/types'

const statusStyles: Record<string, { dot: string; badge: string }> = {
  pending:   { dot: 'bg-yellow-400', badge: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
  confirmed: { dot: 'bg-green-400',  badge: 'bg-green-50 text-green-700 border border-green-200' },
  cancelled: { dot: 'bg-red-400',    badge: 'bg-red-50 text-red-700 border border-red-200' },
  completed: { dot: 'bg-blue-400',   badge: 'bg-blue-50 text-blue-700 border border-blue-200' },
}

export default async function DashboardHomePage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const t = await getTranslations('dashboard')
  const tCommon = await getTranslations('common')

  const [{ data: profile }, { data: bookings }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('bookings')
      .select('id, check_in, check_out, total_price, status, created_at, properties(title, location, images)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  const profileData = profile as Profile | null
  const allBookings = (bookings ?? []) as unknown as Array<{
    id: string
    check_in: string
    check_out: string
    total_price: number
    status: string
    created_at: string
    properties: { title: string; location: string; images: string[] } | null
  }>

  const totalBookings    = allBookings.length
  const activeBookings   = allBookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length
  const totalSpent       = allBookings.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + (b.total_price || 0), 0)
  const completedBookings = allBookings.filter((b) => b.status === 'completed').length
  const recentBookings   = allBookings.slice(0, 4)

  const firstName = profileData?.full_name?.split(' ')[0] ?? user.email?.split('@')[0] ?? t('defaultUser')

  const initials = profileData?.full_name
    ? profileData.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : (user.email?.[0] ?? 'U').toUpperCase()

  return (
    <div className="space-y-8">
      {/* Hero / Greeting Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-secondary via-secondary/90 to-primary p-6 sm:p-8 text-white" suppressHydrationWarning>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold shrink-0 overflow-hidden ring-2 ring-white/30">
              {profileData?.avatar_url ? (
                <Image
                  src={profileData.avatar_url}
                  alt={profileData.full_name ?? t('avatarAlt')}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                {t('greeting', { name: firstName })}
              </h1>
              <p className="text-white/70 text-sm mt-1">{t('greetingSubtitle')}</p>
            </div>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-secondary font-semibold text-sm rounded-full hover:bg-white/90 transition-colors shadow-lg shrink-0"
          >
            {t('heroCta')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label={t('stats.activeBookings')}
          value={activeBookings}
          badge={t('stats.badgeActive')}
          icon={Calendar}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          label={t('stats.totalBookings')}
          value={totalBookings}
          badge={t('stats.badgeTotal')}
          icon={Building2}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          label={t('stats.totalSpent')}
          value={formatPrice(totalSpent)}
          badge={t('stats.badgeSpent')}
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard
          label={t('stats.completedBookings')}
          value={completedBookings}
          badge={t('stats.badgeCompleted')}
          icon={CheckCircle2}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
      </div>

      {/* Lower grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings (2/3) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="text-base font-semibold text-secondary">{t('recentBookings')}</h2>
            <Link
              href="/dashboard/bookings"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
            >
              {t('viewAll')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <CalendarDays className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">{t('noBookings')}</h3>
              <p className="text-sm text-gray-400 mb-5 max-w-xs">{t('noBookingsDesc')}</p>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {t('newBooking')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentBookings.map((booking) => {
                const st = statusStyles[booking.status] ?? statusStyles.pending
                return (
                  <div key={booking.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors">
                    {/* Property thumbnail */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                      {booking.properties?.images?.[0] ? (
                        <Image
                          src={booking.properties.images[0]}
                          alt={booking.properties.title ?? t('property')}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {booking.properties?.title ?? t('property')}
                        </h3>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${st.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {tCommon(`status.${booking.status}` as 'status.pending')}
                        </span>
                      </div>

                      {booking.properties?.location && (
                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{booking.properties.location}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Clock className="w-3 h-3" />
                          <span suppressHydrationWarning>{formatDate(booking.check_in)} – {formatDate(booking.check_out)}</span>
                        </div>
                        <span className="text-sm font-bold text-primary" suppressHydrationWarning>
                          {formatPrice(booking.total_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Profile + Quick Links (1/3) */}
        <div className="space-y-4">
          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-semibold text-secondary mb-4">{t('profileSummary')}</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                {profileData?.avatar_url ? (
                  <Image
                    src={profileData.avatar_url}
                    alt={profileData.full_name ?? t('avatarAlt')}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {profileData?.full_name ?? t('nameNotProvided')}
                </p>
                <p className="text-gray-400 text-xs truncate">{user.email}</p>
              </div>
            </div>
            <Link
              href="/dashboard/profile"
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-primary/5 text-sm font-medium text-gray-700 hover:text-primary transition-colors group"
            >
              <span>{t('editProfile')}</span>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
            </Link>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-semibold text-secondary mb-3">{t('quickLinks')}</h2>
            <div className="space-y-1.5">
              {[
                { href: '/dashboard/bookings', icon: Calendar, label: t('myBookings') },
                { href: '/dashboard/profile', icon: User, label: t('myProfile') },
                { href: '/dashboard/settings', icon: Settings, label: t('settings.title') },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 group transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-secondary transition-colors font-medium">
                    {label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-200 ml-auto group-hover:text-primary/40 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Users, Building2, Calendar, TrendingUp } from 'lucide-react'
import { createSupabaseServer } from '@/lib/supabase/server'
import { StatsCard } from '@/components/admin/StatsCard'
import { getTranslations } from 'next-intl/server'

function calcChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 1000) / 10
}

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServer()
  const t = await getTranslations('admin')
  const tCommon = await getTranslations('common')

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString()

  // Parallel fetch all stats
  const [
    { count: totalUsers },
    { count: lastMonthUsers },
    { count: totalProperties },
    { count: lastMonthProperties },
    { count: currentMonthBookings },
    { count: lastMonthBookings },
    { data: currentRevenueData },
    { data: lastRevenueData },
    { data: recentBookings },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).lte('created_at', lastDayOfLastMonth),
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }).lte('created_at', lastDayOfLastMonth),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', firstDayOfMonth),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', firstDayOfLastMonth).lte('created_at', lastDayOfLastMonth),
    supabase.from('bookings').select('total_price').gte('created_at', firstDayOfMonth).neq('status', 'cancelled'),
    supabase.from('bookings').select('total_price').gte('created_at', firstDayOfLastMonth).lte('created_at', lastDayOfLastMonth).neq('status', 'cancelled'),
    supabase.from('bookings').select('*, property:properties(title), profile:profiles(full_name, email)').order('created_at', { ascending: false }).limit(10),
  ])

  const monthlyRevenue = currentRevenueData?.reduce((sum, b) => sum + (b.total_price || 0), 0) ?? 0
  const lastMonthRevenue = lastRevenueData?.reduce((sum, b) => sum + (b.total_price || 0), 0) ?? 0

  const stats = [
    {
      title: t('stats.totalUsers'),
      value: (totalUsers ?? 0).toLocaleString(),
      icon: Users,
      change: calcChange(totalUsers ?? 0, lastMonthUsers ?? 0),
    },
    {
      title: t('stats.properties'),
      value: (totalProperties ?? 0).toLocaleString(),
      icon: Building2,
      change: calcChange(totalProperties ?? 0, lastMonthProperties ?? 0),
    },
    {
      title: t('stats.bookingsMTD'),
      value: (currentMonthBookings ?? 0).toLocaleString(),
      icon: Calendar,
      change: calcChange(currentMonthBookings ?? 0, lastMonthBookings ?? 0),
    },
    {
      title: t('stats.revenueMTD'),
      value: `€${monthlyRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      change: calcChange(monthlyRevenue, lastMonthRevenue),
    },
  ]

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboardTitle')}</h1>
        <p className="mt-1 text-sm text-gray-600">{t('dashboardSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} changeLabel={t('stats.sinceLastMonth')} />
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{t('recentBookings')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">{t('table.property')}</th>
                <th className="px-6 py-3">{t('table.guest')}</th>
                <th className="px-6 py-3">{t('table.period')}</th>
                <th className="px-6 py-3">{t('table.amount')}</th>
                <th className="px-6 py-3">{t('table.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(!recentBookings || recentBookings.length === 0) ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {t('noBookingsYet')}
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => {
                  const property = booking.property as unknown as { title: string } | null
                  const profile = booking.profile as unknown as { full_name: string | null; email: string } | null
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {property?.title ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {profile?.full_name || profile?.email || '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(booking.check_in).toLocaleDateString('de-DE')} –{' '}
                        {new Date(booking.check_out).toLocaleDateString('de-DE')}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        €{booking.total_price?.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] ?? 'bg-gray-100 text-gray-800'}`}>
                          {tCommon(`status.${booking.status}` as 'status.pending' | 'status.confirmed' | 'status.cancelled' | 'status.completed')}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

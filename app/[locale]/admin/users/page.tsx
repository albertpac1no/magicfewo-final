import { createSupabaseServer } from '@/lib/supabase/server'
import { UsersClient } from './users-client'

export const metadata = { title: 'Benutzer – Admin' }

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServer()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch booking counts per user
  const userIds = (profiles ?? []).map((p) => p.id)
  let bookingCounts: Record<string, number> = {}

  if (userIds.length > 0) {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('user_id')
      .in('user_id', userIds)

    if (bookings) {
      bookingCounts = bookings.reduce((acc: Record<string, number>, b) => {
        acc[b.user_id] = (acc[b.user_id] || 0) + 1
        return acc
      }, {})
    }
  }

  const usersWithCounts = (profiles ?? []).map((p) => ({
    ...p,
    booking_count: bookingCounts[p.id] || 0,
  }))

  return <UsersClient users={usersWithCounts} />
}

import { createSupabaseServer } from '@/lib/supabase/server'
import { BookingsClient } from './bookings-client'

export const metadata = { title: 'Buchungen – Admin' }

export default async function AdminBookingsPage() {
  const supabase = await createSupabaseServer()

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      profiles!bookings_user_id_fkey (
        full_name,
        email,
        phone
      ),
      properties!bookings_property_id_fkey (
        id,
        title,
        location,
        images,
        price_per_night
      )
    `)
    .order('created_at', { ascending: false })

  return <BookingsClient bookings={bookings ?? []} />
}

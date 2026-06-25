import { createSupabaseServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BookingsList } from '@/components/dashboard/BookingsList'

export default async function BookingsPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, check_in, check_out, guests, total_price, status, created_at, properties(title, location, images)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const safeBookings = (bookings ?? []).map((b: Record<string, unknown>) => {
    const props = b.properties as { title: string; location: string; images: string[] } | null
    return {
      id: b.id as string,
      check_in: b.check_in as string,
      check_out: b.check_out as string,
      guests: b.guests as number,
      total_price: b.total_price as number,
      status: b.status as string,
      created_at: b.created_at as string,
      properties: props,
    }
  })

  return <BookingsList bookings={safeBookings} />
}

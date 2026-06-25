import { notFound } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { BookingDetailClient } from './booking-detail-client'

export const metadata = { title: 'Buchungsdetails – Admin' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminBookingDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const { data: booking, error } = await supabase
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
        price_per_night,
        bedrooms,
        bathrooms,
        max_guests
      )
    `)
    .eq('id', id)
    .single()

  if (error || !booking) notFound()

  return <BookingDetailClient booking={booking} />
}

'use server'

import { z } from 'zod'
import { createSupabaseServer } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { differenceInDays } from 'date-fns'

const BookingSchema = z.object({
  property_id: z.string().uuid(),
  check_in: z.string().date(),
  check_out: z.string().date(),
  guests: z.coerce.number().int().min(1),
  payment_method: z.enum(['bank-transfer', 'credit-card', 'paypal']),
  full_name: z.string().min(2),
  phone: z.string().min(5),
  special_requests: z.string().optional(),
})

export async function createBooking(formData: FormData) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht angemeldet' }

  const parsed = BookingSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Ungültige Eingabe', issues: parsed.error.issues }

  const { check_in, check_out, property_id, payment_method } = parsed.data

  // Validate payment method eligibility server-side
  if (payment_method !== 'bank-transfer') {
    const { data: completedBooking } = await supabase
      .from('bookings').select('id').eq('user_id', user.id).eq('status', 'completed').limit(1).single()
    if (!completedBooking) return { error: 'Diese Zahlungsmethode ist erst nach einer erfolgreichen Buchung verfügbar.' }
  }

  // Recalculate price server-side — NEVER trust client
  const [{ data: property }, { data: settings }] = await Promise.all([
    supabase.from('properties').select('price_per_night, special_offer_price, is_special_offer, max_guests').eq('id', property_id).single(),
    supabase.from('settings').select('service_fee, cleaning_fee').single(),
  ])
  if (!property || !settings) return { error: 'Unterkunft nicht gefunden' }
  if (parsed.data.guests > property.max_guests) return { error: `Maximal ${property.max_guests} Gäste erlaubt` }

  const nights = differenceInDays(new Date(check_out), new Date(check_in))
  if (nights <= 0) return { error: 'Ungültige Daten' }

  const pricePerNight = property.is_special_offer && property.special_offer_price
    ? property.special_offer_price : property.price_per_night
  const totalPrice = pricePerNight * nights + Number(settings.service_fee) + Number(settings.cleaning_fee)

  const { error } = await supabase.from('bookings').insert({
    user_id: user.id,
    property_id,
    check_in,
    check_out,
    guests: parsed.data.guests,
    total_price: totalPrice,
    status: 'pending',
    payment_method,
    special_requests: parsed.data.special_requests ?? null,
  })

  if (error?.message?.includes('Diese Daten sind bereits gebucht'))
    return { error: 'Der gewählte Zeitraum ist bereits gebucht. Bitte wählen Sie andere Daten.' }
  if (error) return { error: error.message }

  // Update profile if name/phone provided
  await supabase.from('profiles').update({
    full_name: parsed.data.full_name,
    phone: parsed.data.phone,
  }).eq('id', user.id)

  revalidatePath('/dashboard/bookings')
  return { success: true }
}

export async function cancelBooking(bookingId: string) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht angemeldet' }

  // Verify ownership and status
  const { data: booking } = await supabase
    .from('bookings').select('id, user_id, status').eq('id', bookingId).single()

  if (!booking) return { error: 'Buchung nicht gefunden' }
  if (booking.user_id !== user.id) return { error: 'Keine Berechtigung' }
  if (booking.status !== 'pending') return { error: 'Nur ausstehende Buchungen können storniert werden' }

  const { error } = await supabase
    .from('bookings').update({ status: 'cancelled' }).eq('id', bookingId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/bookings')
  return { success: true }
}

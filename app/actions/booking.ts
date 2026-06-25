'use server'

import { z } from 'zod'
import { createSupabaseServer } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { differenceInDays } from 'date-fns'
import { getTranslations } from 'next-intl/server'

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
  const t = await getTranslations('booking')
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: t('errors.notLoggedIn') }

  const parsed = BookingSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: t('errors.invalidInput'), issues: parsed.error.issues }

  const { check_in, check_out, property_id, payment_method } = parsed.data

  // Validate payment method eligibility server-side
  if (payment_method !== 'bank-transfer') {
    const { data: completedBooking } = await supabase
      .from('bookings').select('id').eq('user_id', user.id).eq('status', 'completed').limit(1).single()
    if (!completedBooking) return { error: t('errors.paymentMethodRestricted') }
  }

  // Recalculate price server-side — NEVER trust client
  const [{ data: property }, { data: settings }] = await Promise.all([
    supabase.from('properties').select('price_per_night, special_offer_price, is_special_offer, max_guests').eq('id', property_id).single(),
    supabase.from('settings').select('service_fee, cleaning_fee').single(),
  ])
  if (!property || !settings) return { error: t('errors.propertyNotFound') }
  if (parsed.data.guests > property.max_guests) return { error: t('errors.maxGuestsExceeded', { count: property.max_guests }) }

  const nights = differenceInDays(new Date(check_out), new Date(check_in))
  if (nights <= 0) return { error: t('errors.invalidDates') }

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
    return { error: t('errors.dateAlreadyBooked') }
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
  const t = await getTranslations('booking')
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: t('errors.notLoggedIn') }

  // Verify ownership and status
  const { data: booking } = await supabase
    .from('bookings').select('id, user_id, status').eq('id', bookingId).single()

  if (!booking) return { error: t('errors.bookingNotFound') }
  if (booking.user_id !== user.id) return { error: t('errors.unauthorized') }
  if (booking.status !== 'pending') return { error: t('errors.onlyPendingCanBeCancelled') }

  const { error } = await supabase
    .from('bookings').update({ status: 'cancelled' }).eq('id', bookingId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/bookings')
  return { success: true }
}

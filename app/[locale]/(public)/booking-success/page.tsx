import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CheckCircle, Calendar, Mail, Clock, Shield, Home } from 'lucide-react'
import { createSupabaseServer } from '@/lib/supabase/server'
import { formatDate, formatPrice, generateBookingReference } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('bookingSuccess.title'),
    description: t('bookingSuccess.description'),
    openGraph: {
      title: t('bookingSuccess.title'),
      description: t('bookingSuccess.description'),
      url: '/booking-success',
    },
  }
}

export default async function BookingSuccessPage() {
  const supabase = await createSupabaseServer()
  const t = await getTranslations('booking')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, properties(title, location, images)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!booking) redirect('/properties')

  const property = booking.properties as { title: string; location: string; images: string[] } | null
  const bookingRef = generateBookingReference()

  return (
    <div className="min-h-screen bg-gray-light py-12 px-4">
      <div className="max-w-lg mx-auto space-y-5">
        {/* Success card */}
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-9 h-9 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-secondary mb-2">{t('successTitle')}</h1>
          <p className="text-gray-500 text-sm mb-5">
            {t('successMessage')}
          </p>
          <div className="inline-flex items-center gap-2 bg-gray-light px-4 py-2 rounded-full">
            <span className="text-xs text-gray-500">{t('bookingReference')}</span>
            <span className="font-mono font-bold text-secondary tracking-wider text-sm">
              {bookingRef}
            </span>
          </div>
        </div>

        {/* Booking details */}
        {property && (
          <div className="card overflow-hidden">
            {property.images?.[0] && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-5 space-y-3">
              <h2 className="font-semibold text-secondary">{property.title}</h2>
              <p className="text-sm text-gray-500">{property.location}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 block text-xs">{t('checkIn')}</span>
                  <span className="font-medium text-secondary">{formatDate(booking.check_in)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">{t('checkOut')}</span>
                  <span className="font-medium text-secondary">{formatDate(booking.check_out)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-sm font-medium text-gray-700">{t('totalAmount')}</span>
                <span className="text-lg font-bold text-primary">{formatPrice(booking.total_price)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Next steps */}
        <div className="card p-6">
          <h2 className="font-semibold text-secondary mb-4 text-sm uppercase tracking-wide">
            {t('nextStepsTitle')}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary">
                  {t('reviewStep')}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('reviewStepText')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary">
                  {t('paymentStep')}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('paymentStepText')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary">
                  {t('confirmStep')}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('confirmStepText')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/bookings"
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
          >
            <Calendar className="w-4 h-4" />
            {t('myBookings')}
          </Link>
          <div className="flex gap-3">
            <Link
              href="/kontakt"
              className="flex-1 flex items-center justify-center gap-1.5 text-gray-500 hover:text-primary text-sm transition-colors border border-gray-200 rounded-full py-2.5"
            >
              <Mail className="w-4 h-4" />
              {t('contact')}
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 text-gray-500 hover:text-primary text-sm transition-colors border border-gray-200 rounded-full py-2.5"
            >
              <Home className="w-4 h-4" />
              {t('homepage')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

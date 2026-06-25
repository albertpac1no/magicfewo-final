import { notFound, redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ChevronLeft } from 'lucide-react'
import { createSupabaseServer } from '@/lib/supabase/server'
import { getSettings } from '@/lib/settings'
import { BookingForm } from '@/components/booking/BookingForm'

interface Props {
  params: Promise<{ id: string; locale: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params
  const supabase = await createSupabaseServer()
  const [t, tm] = await Promise.all([
    getTranslations({ locale, namespace: 'booking' }),
    getTranslations({ locale, namespace: 'meta' }),
  ])
  const { data: property } = await supabase
    .from('properties')
    .select('title')
    .eq('id', id)
    .single()

  if (!property) return { title: t('propertyNotFound') }

  const title = `${t('completeBooking')}: ${property.title} | Gesino Reisen`
  const description = tm('booking.description')
  return {
    title,
    description,
    openGraph: { title, description, url: `/properties/${id}/book` },
  }
}

export default async function BookingPage({ params, searchParams }: Props) {
  const { id } = await params
  const sp = await searchParams
  const supabase = await createSupabaseServer()
  const t = await getTranslations('booking')

  // Auth check — redirect if not logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth?redirect=/properties/${id}/book`)

  // Fetch data in parallel
  const [{ data: property }, settings, { data: profile }] = await Promise.all([
    supabase.from('properties').select('*').eq('id', id).single(),
    getSettings(),
    supabase.from('profiles').select('*').eq('id', user.id).single(),
  ])

  if (!property) notFound()

  // Defaults
  const today = new Date().toISOString().split('T')[0]
  const checkIn = sp.checkIn ?? today
  const checkOut = sp.checkOut ?? ''
  const guests = sp.guests ? parseInt(sp.guests, 10) : 1

  const safeProfile = profile ?? {
    id: user.id,
    email: user.email ?? '',
    full_name: null,
    avatar_url: null,
    phone: null,
    address: null,
    city: null,
    postal_code: null,
    country: null,
    notification_settings: { emailNotifications: true, marketingEmails: false },
    privacy_settings: { profileVisible: true, shareActivity: false },
    role: 'user' as const,
    created_at: '',
    updated_at: '',
  }

  return (
    <div className="py-8 md:py-12 bg-gray-light min-h-screen">
      <div className="container">
        <Link
          href={`/properties/${property.id}`}
          className="inline-flex items-center text-gray-500 hover:text-primary transition-colors mb-6 text-sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {t('backToProperty')}
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-8">
          {t('completeBooking')}
        </h1>

        <BookingForm
          property={property}
          settings={settings}
          profile={safeProfile}
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          initialGuests={guests}
        />
      </div>
    </div>
  )
}

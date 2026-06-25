'use client'

import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { differenceInDays } from 'date-fns'
import { useTranslations } from 'next-intl'
import {
  MapPin, Bed, Bath, Users, CreditCard, ArrowLeft, Shield,
} from 'lucide-react'
import { createBooking } from '@/app/actions/booking'
import { Link } from '@/i18n/navigation'
import { BookingSteps } from '@/components/booking/BookingSteps'
import { PaymentMethodSelector } from '@/components/booking/PaymentMethodSelector'
import { PriceBreakdown } from '@/components/properties/PriceBreakdown'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import type { Property, Profile, Settings } from '@/lib/types'

type PaymentMethod = 'bank-transfer' | 'credit-card' | 'paypal'

interface BookingFormProps {
  property: Property
  settings: Settings
  profile: Profile
  initialCheckIn: string
  initialCheckOut: string
  initialGuests: number
}

interface FormValues {
  check_in: string
  check_out: string
  guests: number
  full_name: string
  phone: string
  special_requests: string
}

export function BookingForm({
  property,
  settings,
  profile,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}: BookingFormProps) {
  const router = useRouter()
  const t = useTranslations('booking')
  const [step, setStep] = useState<1 | 2>(1)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      check_in: initialCheckIn,
      check_out: initialCheckOut,
      guests: initialGuests,
      full_name: profile.full_name ?? '',
      phone: profile.phone ?? '',
      special_requests: '',
    },
  })

  const checkIn = watch('check_in')
  const checkOut = watch('check_out')

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    return Math.max(0, differenceInDays(new Date(checkOut), new Date(checkIn)))
  }, [checkIn, checkOut])

  const effectivePrice =
    property.is_special_offer && property.special_offer_price
      ? property.special_offer_price
      : property.price_per_night

  const totalPrice = effectivePrice * nights + settings.booking_cleaning_fee + settings.booking_service_fee

  const todayStr = new Date().toISOString().split('T')[0]

  function handleContinueToPayment(data: FormValues) {
    // Basic client-side check
    if (differenceInDays(new Date(data.check_out), new Date(data.check_in)) <= 0) {
      toast.error(t('validation.checkOutAfterCheckIn'))
      return
    }
    setStep(2)
  }

  function handleFinalSubmit() {
    if (!paymentMethod) {
      toast.error(t('validation.selectPaymentMethod'))
      return
    }

    const values = watch()

    const formData = new FormData()
    formData.set('property_id', property.id)
    formData.set('check_in', values.check_in)
    formData.set('check_out', values.check_out)
    formData.set('guests', String(values.guests))
    formData.set('payment_method', paymentMethod)
    formData.set('full_name', values.full_name)
    formData.set('phone', values.phone)
    if (values.special_requests) {
      formData.set('special_requests', values.special_requests)
    }

    startTransition(async () => {
      const result = await createBooking(formData)
      if (result.error) {
        toast.error(result.error)
      } else if (result.success) {
        router.push('/booking-success')
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Left: Property Summary */}
      <div className="lg:col-span-2">
        <div className="card overflow-hidden sticky top-8">
          {property.images?.[0] && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-56 object-cover"
            />
          )}
          <div className="p-5">
            <h2 className="text-lg font-bold text-secondary mb-1">{property.title}</h2>
            <div className="flex items-center text-gray-500 text-sm mb-4">
              <MapPin className="w-4 h-4 mr-1 text-primary flex-shrink-0" />
              {property.location}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-gray-400" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-gray-400" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{t('labels.maxGuests', { count: property.max_guests })}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              {property.is_special_offer && property.special_offer_price ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">
                    {property.special_offer_price} €
                  </span>
                  <span className="text-gray-400 line-through text-sm">
                    {property.price_per_night} €
                  </span>
                  <span className="text-gray-500 text-sm">{t('labels.perNight')}</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-secondary">
                    {property.price_per_night} €
                  </span>
                  <span className="text-gray-500 text-sm">{t('labels.perNight')}</span>
                </div>
              )}
            </div>

            {/* Price breakdown when dates selected */}
            {nights > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <PriceBreakdown
                  pricePerNight={property.price_per_night}
                  nights={nights}
                  cleaningFee={settings.booking_cleaning_fee}
                  serviceFee={settings.booking_service_fee}
                  isSpecialOffer={property.is_special_offer}
                  specialOfferPrice={property.special_offer_price}
                />
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
              <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>{t('info.freeCancellation', { hours: settings.booking_free_cancellation_hours })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="lg:col-span-3">
        <div className="card p-6">
          <BookingSteps currentStep={step} />

          {step === 1 ? (
            <form onSubmit={handleSubmit(handleContinueToPayment)} className="space-y-5">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t('labels.checkIn')}
                  type="date"
                  min={todayStr}
                  {...register('check_in', { required: t('validation.required') })}
                  error={errors.check_in?.message}
                />
                <Input
                  label={t('labels.checkOut')}
                  type="date"
                  min={checkIn || todayStr}
                  {...register('check_out', { required: t('validation.required') })}
                  error={errors.check_out?.message}
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('labels.guests')}
                </label>
                <select
                  {...register('guests', { required: true })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors appearance-none"
                >
                  {Array.from({ length: property.max_guests }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n === 1 ? t('labels.guestSingular', { count: n }) : t('labels.guestPlural', { count: n })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Personal info */}
              <Input
                label={t('labels.fullName')}
                placeholder={t('placeholders.fullName')}
                {...register('full_name', { required: t('validation.required'), minLength: { value: 2, message: t('validation.minChars', { count: 2 }) } })}
                error={errors.full_name?.message}
              />

              <Input
                label={t('labels.email')}
                type="email"
                value={profile.email}
                disabled
                className="bg-gray-50"
              />

              <Input
                label={t('labels.phone')}
                type="tel"
                placeholder={t('placeholders.phone')}
                {...register('phone', { required: t('validation.required'), minLength: { value: 5, message: t('validation.minChars', { count: 5 }) } })}
                error={errors.phone?.message}
              />

              <Textarea
                label={t('labels.specialRequests')}
                placeholder={t('placeholders.specialRequests')}
                {...register('special_requests')}
              />

              {/* Total */}
              {nights > 0 && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-lg font-semibold text-secondary">{t('labels.totalPrice')}</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full">
                <CreditCard className="w-5 h-5 mr-2" />
                {t('buttons.continueToPayment')}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                {t('info.termsPrefix')}{' '}
                <Link href="/agb" className="text-primary hover:underline">{t('info.termsLink')}</Link> {t('info.and')}{' '}
                <Link href="/datenschutz" className="text-primary hover:underline">{t('info.privacyLink')}</Link>
              </p>
            </form>
          ) : (
            <div className="space-y-6">
              <PaymentMethodSelector
                userId={profile.id}
                selected={paymentMethod}
                onSelect={setPaymentMethod}
              />

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-secondary">{t('labels.totalAmount')}</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  <p className="text-sm text-gray-600">
                    {t('info.freeCancellationLong', { hours: settings.booking_free_cancellation_hours })}
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('buttons.back')}
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    className="flex-1"
                    disabled={!paymentMethod}
                    loading={isPending}
                    onClick={handleFinalSubmit}
                  >
                    {t('buttons.bookNow')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

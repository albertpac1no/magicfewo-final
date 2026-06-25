'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import {
  ArrowLeft, MapPin, Users, Calendar, Clock, CreditCard,
  Building2, Wallet, CheckCircle, XCircle, Bed, Send, Loader2,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { updateBookingStatus } from '@/app/actions/admin'
import { BankdropEmailModal } from '@/components/admin/BankdropEmailModal'
import { Link } from '@/i18n/navigation'

/* eslint-disable @typescript-eslint/no-explicit-any */

const paymentMethodIcons: Record<string, any> = {
  'credit-card': CreditCard,
  'bank-transfer': Building2,
  'paypal': Wallet,
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function BookingDetailClient({ booking }: { booking: any }) {
  const t = useTranslations('admin')
  const tCommon = useTranslations('common')
  const [showBankdropModal, setShowBankdropModal] = useState(false)
  const [isPending, startTransition] = useTransition()

  const PaymentIcon = paymentMethodIcons[booking.payment_method] || Building2

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      await updateBookingStatus(booking.id, newStatus)
    })
  }

  return (
    <>
      <div>
        <div className="mb-8">
          <Link
            href="/admin/bookings"
            className="inline-flex items-center text-gray-600 hover:text-primary mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('bookings.backToOverview')}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t('bookings.bookingDetails')}</h1>
        </div>

        {/* Guest Information */}
        <div className="bg-white rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">{t('bookings.guestInfo')}</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">{tCommon('name')}</div>
              <div className="font-medium">{booking.profiles?.full_name || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">{tCommon('email')}</div>
              <div className="font-medium">{booking.profiles?.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">{tCommon('phone')}</div>
              <div className="font-medium">{booking.profiles?.phone || tCommon('notProvided')}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">{t('table.status')}</div>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColors[booking.status]}`}>
                {tCommon(`status.${booking.status}` as 'status.pending' | 'status.confirmed' | 'status.cancelled' | 'status.completed')}
              </span>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-xl p-6 mb-8">
          <div className="flex gap-6">
            <div className="w-1/3">
              {booking.properties?.images?.[0] ? (
                <Image
                  src={booking.properties.images[0]}
                  alt={booking.properties.title}
                  width={80}
                  height={80}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-gray-300" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {booking.properties?.title}
              </h3>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                {booking.properties?.location}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center text-gray-600">
                  <Bed className="w-4 h-4 mr-1" />
                  <span className="text-sm">{t('bookings.bedroomsCount', { count: booking.properties?.bedrooms })}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="text-sm">{t('bookings.guestsCount', { count: booking.guests })}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">{formatDate(booking.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">{t('bookings.bookingDetails')}</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">{t('table.checkIn')}</div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                {formatDate(booking.check_in)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">{t('table.checkOut')}</div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                {formatDate(booking.check_out)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">{t('bookings.paymentMethod')}</div>
              <div className="flex items-center">
                <PaymentIcon className="w-4 h-4 text-gray-400 mr-2" />
                {tCommon(`paymentMethods.${booking.payment_method === 'credit-card' ? 'creditCard' : booking.payment_method === 'bank-transfer' ? 'bankTransfer' : 'paypal'}`)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">{t('bookings.totalPrice')}</div>
              <div className="text-xl font-bold text-primary">{booking.total_price} €</div>
            </div>
          </div>
          {booking.special_requests && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="text-sm text-gray-500 mb-1">{t('bookings.specialRequests')}</div>
              <div className="text-gray-700">{booking.special_requests}</div>
            </div>
          )}
        </div>

        {/* Status Management */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">{t('bookings.statusManagement')}</h3>
          <div className="flex gap-4">
            {isPending ? (
              <div className="flex items-center px-4 py-2 rounded-lg bg-gray-100">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t('bookings.statusUpdating')}
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleStatusChange('confirmed')}
                  disabled={booking.status === 'confirmed'}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5" />
                  {tCommon('actions.confirm')}
                </button>
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={booking.status === 'cancelled'}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-5 h-5" />
                  {tCommon('actions.cancelBooking')}
                </button>
                <button
                  onClick={() => handleStatusChange('completed')}
                  disabled={booking.status === 'completed'}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5" />
                  {tCommon('actions.complete')}
                </button>
                <button
                  onClick={() => setShowBankdropModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
                >
                  <Send className="w-5 h-5" />
                  {t('bookings.sendPaymentInfo')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bankdrop Email Modal */}
      {showBankdropModal && (
        <BankdropEmailModal
          isOpen={showBankdropModal}
          onClose={() => setShowBankdropModal(false)}
          bookingId={booking.id}
          guestEmail={booking.profiles?.email || ''}
          guestName={booking.profiles?.full_name || ''}
          amount={booking.total_price}
        />
      )}
    </>
  )
}

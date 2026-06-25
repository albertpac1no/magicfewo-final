'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Search,
  Loader2,
  Building2,
  ArrowRight,
  CalendarDays,
  X,
} from 'lucide-react'
import { formatDate, formatPrice } from '@/lib/utils'
import { cancelBooking } from '@/app/actions/booking'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'

const statusStyles: Record<string, { dot: string; badge: string }> = {
  pending:   { dot: 'bg-yellow-400', badge: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
  confirmed: { dot: 'bg-green-400',  badge: 'bg-green-50 text-green-700 border border-green-200' },
  cancelled: { dot: 'bg-red-400',    badge: 'bg-red-50 text-red-700 border border-red-200' },
  completed: { dot: 'bg-blue-400',   badge: 'bg-blue-50 text-blue-700 border border-blue-200' },
}

interface BookingItem {
  id: string
  check_in: string
  check_out: string
  guests: number
  total_price: number
  status: string
  created_at: string
  properties: {
    title: string
    location: string
    images: string[]
  } | null
}

export function BookingsList({ bookings: initial }: { bookings: BookingItem[] }) {
  const [bookings, setBookings] = useState(initial)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const t = useTranslations('dashboard')
  const tCommon = useTranslations('common')

  const statusKeys = ['all', 'pending', 'confirmed', 'cancelled', 'completed'] as const

  const countForStatus = (key: string) => {
    if (key === 'all') return bookings.length
    return bookings.filter((b) => b.status === key).length
  }

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    const matchesSearch =
      !searchTerm ||
      (b.properties?.title ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.properties?.location ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleCancel = (id: string) => {
    setCancellingId(id)
    startTransition(async () => {
      const result = await cancelBooking(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(t('bookingCancelled'))
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
        )
      }
      setCancellingId(null)
      setConfirmCancelId(null)
    })
  }

  const tabLabel = (key: string) => {
    if (key === 'all') return t('filterAll')
    return tCommon(`status.${key}` as 'status.pending')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary">{t('myBookings')}</h1>

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-2">
          {statusKeys.map((key) => {
            const count = countForStatus(key)
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  statusFilter === key
                    ? 'bg-primary text-white shadow-sm shadow-primary/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tabLabel(key)}
                <span
                  className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
                    statusFilter === key ? 'bg-white/20 text-white' : 'bg-white text-gray-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <CalendarDays className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">{t('noBookingsFound')}</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">{t('noBookingsYet')}</p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {t('discoverProperties')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const st = statusStyles[booking.status] ?? statusStyles.pending
            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-44 h-44 shrink-0 bg-gray-100 relative">
                    {booking.properties?.images?.[0] ? (
                      <Image
                        src={booking.properties.images[0]}
                        alt={booking.properties.title ?? t('property')}
                        fill
                        sizes="(max-width: 640px) 100vw, 176px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-10 h-10 text-gray-200" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-base font-semibold text-secondary leading-tight">
                        {booking.properties?.title ?? t('property')}
                      </h3>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${st.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {tCommon(`status.${booking.status}` as 'status.pending')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mb-4">
                      {booking.properties?.location && (
                        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{booking.properties.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {booking.guests} {booking.guests === 1 ? t('guest') : t('guests')}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{t('checkIn')}: {formatDate(booking.check_in)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{t('checkOut')}: {formatDate(booking.check_out)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{t('bookedOn', { date: formatDate(booking.created_at) })}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => setConfirmCancelId(booking.id)}
                            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                          >
                            {t('cancelBooking')}
                          </button>
                        )}
                        <div className="text-right">
                          <p className="text-xs text-gray-400">{t('totalPrice')}</p>
                          <p className="text-lg font-bold text-primary leading-tight" suppressHydrationWarning>
                            {formatPrice(booking.total_price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Cancel confirmation modal */}
      <Modal
        open={!!confirmCancelId}
        onClose={() => setConfirmCancelId(null)}
        title={t('confirmCancelTitle')}
      >
        <div className="space-y-5">
          <p className="text-sm text-gray-600">{t('confirmCancel')}</p>
          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => setConfirmCancelId(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              {t('no')}
            </button>
            <button
              onClick={() => confirmCancelId && handleCancel(confirmCancelId)}
              disabled={!!cancellingId}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {cancellingId ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('cancelBooking')}...
                </>
              ) : (
                t('yes')
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

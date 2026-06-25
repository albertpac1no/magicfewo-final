'use client'

import { useState, useTransition } from 'react'
import { Search, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { updateBookingStatus } from '@/app/actions/admin'
import { Link } from '@/i18n/navigation'

/* eslint-disable @typescript-eslint/no-explicit-any */

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })
}

interface BookingsClientProps {
  bookings: any[]
}

export function BookingsClient({ bookings }: BookingsClientProps) {
  const t = useTranslations('admin')
  const tCommon = useTranslations('common')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isPending, startTransition] = useTransition()
  const [actionId, setActionId] = useState<string | null>(null)

  const statusKeys = ['all', 'pending', 'confirmed', 'cancelled', 'completed'] as const

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      (b.profiles?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.profiles?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.properties?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    setActionId(bookingId)
    startTransition(async () => {
      await updateBookingStatus(bookingId, newStatus)
      setActionId(null)
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('bookings.title')}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {t('bookings.subtitle')}
        </p>
      </div>

      {/* Status tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-6">
          {statusKeys.map((key) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                statusFilter === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tCommon(`status.${key}`)}
              <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                {key === 'all'
                  ? bookings.length
                  : bookings.filter((b) => b.status === key).length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('bookings.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">{t('table.booking')}</th>
              <th className="px-6 py-3 font-medium">{t('table.guest')}</th>
              <th className="px-6 py-3 font-medium">{t('table.property')}</th>
              <th className="px-6 py-3 font-medium">{t('table.checkIn')}</th>
              <th className="px-6 py-3 font-medium">{t('table.checkOut')}</th>
              <th className="px-6 py-3 font-medium">{t('table.amount')}</th>
              <th className="px-6 py-3 font-medium">{t('table.status')}</th>
              <th className="px-6 py-3 font-medium">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  {t('bookings.noBookings')}
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/admin/bookings/${booking.id}`} className="text-primary hover:underline font-mono text-xs">
                      {booking.id.substring(0, 8)}...
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{booking.profiles?.full_name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{booking.profiles?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{booking.properties?.title || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{booking.properties?.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(booking.check_in)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(booking.check_out)}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{booking.total_price} €</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                      {tCommon(`status.${booking.status}` as 'status.pending' | 'status.confirmed' | 'status.cancelled' | 'status.completed')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {isPending && actionId === booking.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      ) : (
                        <>
                          {booking.status !== 'confirmed' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              title={tCommon('actions.confirm')}
                              className="p-1 rounded hover:bg-green-50 text-green-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {booking.status !== 'cancelled' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              title={tCommon('actions.cancelBooking')}
                              className="p-1 rounded hover:bg-red-50 text-red-600"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          {booking.status !== 'completed' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'completed')}
                              title={tCommon('actions.complete')}
                              className="p-1 rounded hover:bg-blue-50 text-blue-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <Link
                            href={`/admin/bookings/${booking.id}`}
                            className="p-1 rounded hover:bg-gray-100 text-gray-500 text-xs ml-1"
                          >
                            {t('bookings.details')}
                          </Link>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

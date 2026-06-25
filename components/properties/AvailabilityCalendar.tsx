'use client'

import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { createSupabaseClient } from '@/lib/supabase/client'

interface AvailabilityCalendarProps {
  propertyId: string
}

interface BookedRange {
  check_in: string
  check_out: string
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function isDateBlocked(date: Date, bookedRanges: BookedRange[]): boolean {
  const d = date.toISOString().split('T')[0]
  return bookedRanges.some((r) => d >= r.check_in && d < r.check_out)
}

export function AvailabilityCalendar({ propertyId }: AvailabilityCalendarProps) {
  const locale = useLocale()
  const t = useTranslations('properties')
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([])
  const [loading, setLoading] = useState(true)

  const monthName = useMemo(() => {
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
      new Date(year, month, 1)
    )
  }, [locale, year, month])

  const dayLabels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' })
    // Monday-first week: Mon=1..Sun=7
    return [1, 2, 3, 4, 5, 6, 7].map((d) => {
      const date = new Date(2024, 0, d) // Jan 1 2024 = Mon
      return fmt.format(date)
    })
  }, [locale])

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true)
      const supabase = createSupabaseClient()
      const { data } = await supabase
        .from('bookings')
        .select('check_in, check_out')
        .eq('property_id', propertyId)
        .in('status', ['pending', 'confirmed'])
        .gte('check_out', new Date().toISOString().split('T')[0])

      setBookedRanges(data ?? [])
      setLoading(false)
    }
    fetchBookings()
  }, [propertyId])

  const prevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11) }
    else setMonth(month - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0) }
    else setMonth(month + 1)
  }

  const days = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfWeek(year, month)
    const cells: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  }, [year, month])

  const isPast = (day: number) => {
    const d = new Date(year, month, day)
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return d < t
  }

  return (
    <div className="card p-6">
      <h2 className="section-title mb-5">{t('availability')}</h2>

      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <span className="font-semibold text-secondary capitalize">
          {monthName}
        </span>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayLabels.map((d, i) => (
              <div key={i} className="text-center text-xs font-medium text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />
              const date = new Date(year, month, day)
              const blocked = isDateBlocked(date, bookedRanges)
              const past = isPast(day)

              return (
                <div
                  key={day}
                  className={`text-center py-2 text-sm rounded-lg ${
                    blocked
                      ? 'bg-red-50 text-red-400 line-through'
                      : past
                        ? 'text-gray-300'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {day}
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-red-50 border border-red-200" />
              <span>{t('booked')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-white border border-gray-200" />
              <span>{t('available')}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

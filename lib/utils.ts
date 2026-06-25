import { type ClassValue, clsx } from 'clsx'
import { differenceInDays, format } from 'date-fns'
import { de } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function calculateNights(checkIn: string | Date, checkOut: string | Date): number {
  return differenceInDays(new Date(checkOut), new Date(checkIn))
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd. MMM yyyy', { locale: de })
}

export function generateBookingReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'MF-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

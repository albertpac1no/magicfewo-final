'use server'

import { createSupabaseServer } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Helper to verify admin
async function verifyAdmin() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht angemeldet', supabase: null, user: null }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Keine Berechtigung', supabase: null, user: null }
  return { error: null, supabase, user }
}

export async function updateBookingStatus(bookingId: string, newStatus: string) {
  const { error: authError, supabase } = await verifyAdmin()
  if (authError || !supabase) return { error: authError || 'Auth failed' }

  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed']
  if (!validStatuses.includes(newStatus)) return { error: 'Ungültiger Status' }

  const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', bookingId)
  if (error) return { error: error.message }

  revalidatePath('/admin/bookings')
  revalidatePath(`/admin/bookings/${bookingId}`)
  revalidatePath('/dashboard/bookings')
  return { success: true }
}

export async function updateUserRole(userId: string, newRole: 'user' | 'admin') {
  const { error: authError, supabase } = await verifyAdmin()
  if (authError || !supabase) return { error: authError || 'Auth failed' }

  if (!['user', 'admin'].includes(newRole)) return { error: 'Ungültige Rolle' }

  const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { success: true }
}

const BankAccountSchema = z.object({
  account_holder: z.string().min(2, 'Kontoinhaber ist erforderlich'),
  iban: z.string().min(15, 'IBAN ist ungültig').max(34),
  bic: z.string().min(8, 'BIC ist ungültig').max(11),
  bank_name: z.string().min(2, 'Bankname ist erforderlich'),
  is_active: z.boolean().default(true),
})

export async function createBankAccount(formData: FormData) {
  const { error: authError, supabase } = await verifyAdmin()
  if (authError || !supabase) return { error: authError || 'Auth failed' }

  const raw = {
    account_holder: formData.get('account_holder') as string,
    iban: (formData.get('iban') as string)?.toUpperCase(),
    bic: (formData.get('bic') as string)?.toUpperCase(),
    bank_name: formData.get('bank_name') as string,
    is_active: formData.get('is_active') === 'true',
  }

  const parsed = BankAccountSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || 'Ungültige Eingabe' }

  const { error } = await supabase.from('bank_accounts').insert(parsed.data)
  if (error) return { error: error.message }

  revalidatePath('/admin/bankdrops')
  return { success: true }
}

export async function updateBankAccount(id: string, formData: FormData) {
  const { error: authError, supabase } = await verifyAdmin()
  if (authError || !supabase) return { error: authError || 'Auth failed' }

  const raw = {
    account_holder: formData.get('account_holder') as string,
    iban: (formData.get('iban') as string)?.toUpperCase(),
    bic: (formData.get('bic') as string)?.toUpperCase(),
    bank_name: formData.get('bank_name') as string,
    is_active: formData.get('is_active') === 'true',
  }

  const parsed = BankAccountSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || 'Ungültige Eingabe' }

  const { error } = await supabase.from('bank_accounts').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/bankdrops')
  return { success: true }
}

export async function deleteBankAccount(id: string) {
  const { error: authError, supabase } = await verifyAdmin()
  if (authError || !supabase) return { error: authError || 'Auth failed' }

  const { error } = await supabase.from('bank_accounts').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/bankdrops')
  return { success: true }
}

export async function toggleBankAccountStatus(id: string, isActive: boolean) {
  const { error: authError, supabase } = await verifyAdmin()
  if (authError || !supabase) return { error: authError || 'Auth failed' }

  const { error } = await supabase.from('bank_accounts').update({ is_active: isActive }).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/bankdrops')
  return { success: true }
}

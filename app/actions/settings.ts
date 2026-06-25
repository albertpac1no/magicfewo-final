'use server'

import { z } from 'zod'
import { createSupabaseServer } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const SettingsSchema = z.object({
  platform_name: z.string().optional().default(''),
  platform_description: z.string().optional().default(''),
  platform_logo_url: z.string().optional().default(''),
  primary_color: z.string().optional().default('#2563eb'),
  secondary_color: z.string().optional().default('#7c3aed'),
  service_fee: z.coerce.number().nonnegative().default(0),
  cleaning_fee: z.coerce.number().nonnegative().default(0),
  min_stay_days: z.coerce.number().int().positive().default(1),
  max_stay_days: z.coerce.number().int().positive().default(30),
  allowed_payment_methods: z.array(z.string()).default(['bank_transfer']),
  free_cancellation_hours: z.coerce.number().int().nonnegative().default(48),
  cancellation_fee_percentage: z.coerce.number().nonnegative().default(0),
})

export async function updateSettings(formData: FormData) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht angemeldet' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Keine Berechtigung' }

  // Collect raw form data, handling array fields
  const raw: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    if (key === 'allowed_payment_methods') {
      if (!raw[key]) {
        raw[key] = formData.getAll(key) as string[]
      }
    } else {
      raw[key] = value
    }
  }

  // Validate with Zod
  const parsed = SettingsSchema.safeParse(raw)
  if (!parsed.success) return { error: 'Invalid settings data' }

  // UPSERT with id = 1 — ALWAYS target singleton
  const { error } = await supabase
    .from('settings')
    .upsert({ id: 1, ...parsed.data })

  if (error) return { error: error.message }

  revalidatePath('/admin/settings')
  revalidatePath('/', 'layout')
  return { success: true }
}

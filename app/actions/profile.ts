'use server'

import { z } from 'zod'
import { createSupabaseServer } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getTranslations } from 'next-intl/server'

export async function uploadAvatar(formData: FormData) {
  const t = await getTranslations('dashboard')
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: t('errors.notLoggedIn') }

  const file = formData.get('file') as File
  if (!file || file.size === 0) return { error: t('errors.noFileSelected') }
  if (file.size > 5 * 1024 * 1024) return { error: t('errors.fileTooLarge') }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const filePath = `${user.id}/avatar-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('profile-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: true })

  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage
    .from('profile-images')
    .getPublicUrl(filePath)

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (updateError) return { error: updateError.message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profile')
  return { success: true, url: publicUrl }
}

const ProfileSchema = z.object({
  full_name: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
})

export async function updateProfile(formData: FormData) {
  const t = await getTranslations('dashboard')
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: t('errors.notLoggedIn') }

  const raw = Object.fromEntries(formData)
  const parsed = ProfileSchema.safeParse(raw)
  if (!parsed.success) return { error: t('errors.invalidInput') }

  const { error } = await supabase
    .from('profiles')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/profile')
  revalidatePath('/dashboard')
  return { success: true }
}

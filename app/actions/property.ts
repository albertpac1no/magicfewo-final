'use server'

import { z } from 'zod'
import { createSupabaseServer } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const PropertySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(2),
  country: z.string().min(2),
  city: z.string().min(2),
  price_per_night: z.coerce.number().positive(),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  max_guests: z.coerce.number().int().min(1),
  amenities: z.string().transform(s => JSON.parse(s)).pipe(z.array(z.string())),
  images: z.string().transform(s => JSON.parse(s)).pipe(z.array(z.string())),
  is_special_offer: z.coerce.boolean().default(false),
  special_offer_price: z.coerce.number().nullable().optional(),
  special_offer_end_date: z.string().nullable().optional(),
})

async function requireAdmin() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht angemeldet' as const, supabase, user: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return { error: 'Keine Berechtigung' as const, supabase, user: null }

  return { error: null, supabase, user }
}

export async function createProperty(formData: FormData) {
  const { error: authError, supabase, user } = await requireAdmin()
  if (authError) return { error: authError }

  const parsed = PropertySchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Ungültige Eingabe', issues: parsed.error.issues }

  const { error } = await supabase.from('properties').insert({
    ...parsed.data,
    owner_id: user!.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/properties')
  revalidatePath('/properties')
  return { success: true }
}

export async function updateProperty(id: string, formData: FormData) {
  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { error: authError }

  const parsed = PropertySchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Ungültige Eingabe', issues: parsed.error.issues }

  const { error } = await supabase.from('properties').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/properties')
  revalidatePath(`/properties/${id}`)
  revalidatePath('/properties')
  return { success: true }
}

export async function deleteProperty(id: string) {
  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { error: authError }

  const { error } = await supabase.from('properties').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/properties')
  revalidatePath('/properties')
  return { success: true }
}

export async function uploadPropertyImage(formData: FormData) {
  const { error: authError, supabase } = await requireAdmin()
  if (authError) return { error: authError }

  const file = formData.get('file') as File
  if (!file) return { error: 'Keine Datei' }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `properties/${fileName}`

  const { error } = await supabase.storage
    .from('property-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: false })

  if (error) return { error: error.message }

  const { data: { publicUrl } } = supabase.storage
    .from('property-images')
    .getPublicUrl(filePath)

  revalidatePath('/admin/properties')
  revalidatePath('/properties')
  return { success: true, url: publicUrl }
}

export async function rewriteDescription(description: string) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  if (!process.env.OPENAI_API_KEY) return { error: 'OpenAI API key not configured' }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 3000,
        messages: [
          {
            role: 'system',
            content: 'Du bist ein erfahrener Immobilien-Texter. Schreibe ansprechende, professionelle Beschreibungen für Ferienwohnungen auf Deutsch. Behalte alle faktischen Details bei, verbessere aber den Stil und die Überzeugungskraft.',
          },
          {
            role: 'user',
            content: `Bitte schreibe diese Beschreibung einer Ferienwohnung um und verbessere sie:\n\n${description}`,
          },
        ],
      }),
    })

    const data = await response.json()
    return { success: true, description: data.choices[0].message.content }
  } catch {
    return { error: 'KI-Umschreibung fehlgeschlagen' }
  }
}

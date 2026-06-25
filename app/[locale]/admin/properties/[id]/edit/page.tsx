import { notFound } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { PropertyForm } from '@/components/admin/PropertyForm'
import type { Property } from '@/lib/types'
import { getTranslations } from 'next-intl/server'

interface EditPropertyPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  const property = data as Property
  const t = await getTranslations('admin')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('properties.editProperty')}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {property.title}
        </p>
      </div>
      <PropertyForm mode="edit" property={property} />
    </div>
  )
}

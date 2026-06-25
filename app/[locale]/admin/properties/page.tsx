import { Plus } from 'lucide-react'
import { createSupabaseServer } from '@/lib/supabase/server'
import type { Property } from '@/lib/types'
import { AdminPropertiesClient } from './client'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export default async function AdminPropertiesPage() {
  const supabase = await createSupabaseServer()
  const t = await getTranslations('admin')

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  const properties = (data ?? []) as Property[]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('properties.title')}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {t('properties.subtitle')}
          </p>
        </div>
        <Link
          href="/admin/properties/add"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('properties.addProperty')}
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error.message}
        </div>
      )}

      <AdminPropertiesClient properties={properties} />
    </div>
  )
}

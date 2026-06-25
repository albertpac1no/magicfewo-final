import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import type { Profile } from '@/lib/types'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('dashboard.title'),
    description: t('dashboard.description'),
    robots: { index: false, follow: false },
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const profile = data as Profile | null
  const isAdmin = profile?.role === 'admin'

  return (
    <DashboardShell
      profile={profile}
      email={user.email ?? ''}
      isAdmin={isAdmin}
    >
      {children}
    </DashboardShell>
  )
}

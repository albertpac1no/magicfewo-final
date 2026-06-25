import { createSupabaseServer } from '@/lib/supabase/server'
import { getSettings } from '@/lib/settings'
import { NavbarClient } from './NavbarClient'
import { TopHeader } from './TopHeader'
import type { Profile } from '@/lib/types'

export async function Navbar() {
  const [supabase, settings] = await Promise.all([
    createSupabaseServer(),
    getSettings(),
  ])

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile: Profile | null = null
  let isAdmin = false

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data as Profile | null
    isAdmin = profile?.role === 'admin'
  }

  return (
    <>
      <TopHeader settings={settings} />
      <NavbarClient
        user={user ? { id: user.id, email: user.email ?? null } : null}
        profile={profile}
        isAdmin={isAdmin}
        platformName={settings.platform_name}
        logoLightUrl={settings.logo_light_url}
        logoDarkUrl={settings.logo_dark_url}
      />
    </>
  )
}

'use client'

import Image from 'next/image'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  Home,
  Sparkles,
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import type { Profile } from '@/lib/types'

const navigationItems = [
  { key: 'dashboard' as const, path: '/admin', icon: LayoutDashboard },
  { key: 'users' as const, path: '/admin/users', icon: Users },
  { key: 'properties' as const, path: '/admin/properties', icon: Building2 },
  { key: 'bookings' as const, path: '/admin/bookings', icon: Calendar },
  { key: 'bankAccounts' as const, path: '/admin/bankdrops', icon: CreditCard },
  { key: 'settings' as const, path: '/admin/settings', icon: Settings },
]

interface AdminSidebarProps {
  profile: Profile | null
}

export function AdminSidebar({ profile }: AdminSidebarProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin'
    return pathname.startsWith(path)
  }

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'A'

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-secondary flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Home className="w-7 h-7 text-white" />
            <Sparkles className="w-3.5 h-3.5 text-white/80 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="text-xl font-bold text-white">Gesino Reisen</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt={profile.full_name || 'Admin Profilbild'} width={40} height={40} className="w-full h-full object-cover rounded-full" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {profile?.full_name || 'Admin'}
            </p>
            <p className="text-xs text-white/60 truncate">{profile?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-2 px-3 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                active
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {t(item.key)}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg w-full transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          {t('signOut')}
        </button>
      </div>
    </aside>
  )
}

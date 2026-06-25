'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Menu, ChevronDown, LayoutDashboard, Settings, LogOut, Shield, Home } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Logo } from './Logo'
import type { Profile } from '@/lib/types'

interface DashboardTopbarProps {
  profile: Profile | null
  email: string
  isAdmin: boolean
  onMenuClick: () => void
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'overview',
  '/dashboard/bookings': 'bookings',
  '/dashboard/profile': 'profile',
  '/dashboard/settings': 'settings',
}

export function DashboardTopbar({ profile, email, isAdmin, onMenuClick }: DashboardTopbarProps) {
  const t = useTranslations('nav')
  const tDash = useTranslations('dashboard')
  const pathname = usePathname()
  const router = useRouter()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const pageKey = PAGE_TITLES[pathname] ?? 'overview'
  const pageTitleMap: Record<string, string> = {
    overview: t('overview'),
    bookings: t('bookings'),
    profile: t('profile'),
    settings: t('settings'),
  }
  const pageTitle = pageTitleMap[pageKey] ?? t('dashboard')

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : (email?.[0] ?? 'U').toUpperCase()

  const handleSignOut = async () => {
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
    setUserMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-1 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="lg:hidden">
            <Logo />
          </div>
          {/* Desktop: page title */}
          <span className="hidden lg:block text-lg font-semibold text-secondary ml-64 pl-4">
            {pageTitle}
          </span>
        </div>

        {/* Right: language + user */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name ?? 'Avatar'}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-medium text-gray-800 truncate max-w-[120px]">
                  {profile?.full_name ?? email}
                </span>
                <span className="text-xs text-gray-400 truncate max-w-[120px]">{email}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20">
                  <div className="px-4 py-2.5 border-b border-gray-50">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {profile?.full_name ?? email}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {t('dashboard')}
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      {t('admin')}
                    </Link>
                  )}
                  <Link
                    href="/"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    {tDash('backToSite')}
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    {t('settings')}
                  </Link>
                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('signOut')}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

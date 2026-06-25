'use client'

import Image from 'next/image'
import { Link, usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import {
  LayoutDashboard,
  Calendar,
  User,
  Settings,
  X,
  Home,
  ChevronRight,
} from 'lucide-react'
import type { Profile } from '@/lib/types'

const navigationItems = [
  { key: 'overview' as const, path: '/dashboard', icon: LayoutDashboard },
  { key: 'bookings' as const, path: '/dashboard/bookings', icon: Calendar },
  { key: 'profile' as const, path: '/dashboard/profile', icon: User },
  { key: 'settings' as const, path: '/dashboard/settings', icon: Settings },
]

interface DashboardSidebarProps {
  profile: Profile | null
  mobileOpen: boolean
  onMobileClose: () => void
}

export function DashboardSidebar({ profile, mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const t = useTranslations('nav')
  const tDash = useTranslations('dashboard')
  const tC = useTranslations('common')
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(path)
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* User card */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden ring-2 ring-primary/20">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name ?? tDash('avatarAlt')}
                width={44}
                height={44}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-secondary truncate">
              {profile?.full_name ?? t('dashboard')}
            </p>
            <p className="text-xs text-gray-400 truncate">{profile?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
          {t('dashboard')}
        </p>
        {navigationItems.map((item) => {
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-primary text-white shadow-sm shadow-primary/25'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-secondary'
              }`}
            >
              <item.icon
                className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-white' : 'text-gray-400 group-hover:text-secondary'}`}
                size={18}
              />
              <span>{t(item.key)}</span>
              {active && <ChevronRight className="w-4 h-4 ml-auto text-white/60" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-4 space-y-1">
        <Link
          href="/"
          onClick={onMobileClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-secondary transition-colors"
        >
          <Home className="w-4.5 h-4.5 text-gray-400" size={18} />
          {tDash('backToSite')}
        </Link>
        <p className="text-xs text-gray-300 px-3 pt-2">
          © 2026 Gesino Reisen
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0">
          <Link href="/" onClick={onMobileClose}>
            <span className="text-lg font-bold text-secondary">Gesino Reisen</span>
          </Link>
          <button
            onClick={onMobileClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label={tC('closeNavigation')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Desktop fixed rail */}
      <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-100 flex-col z-30 overflow-y-auto">
        {sidebarContent}
      </aside>
    </>
  )
}

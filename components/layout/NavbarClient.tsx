'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ChevronDown, Menu, X, LogOut, Settings, LayoutDashboard, Shield } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Logo } from './Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { Profile } from '@/lib/types'

interface NavbarClientProps {
  user: { id: string; email: string | null } | null
  profile: Profile | null
  isAdmin: boolean
  platformName?: string | null
  logoLightUrl?: string | null
  logoDarkUrl?: string | null
}

export function NavbarClient({
  user,
  profile,
  isAdmin,
  platformName,
  logoLightUrl,
  logoDarkUrl,
}: NavbarClientProps) {
  const t = useTranslations('nav')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const userMenuRef = useRef<HTMLDivElement>(null)

  const [, startMenuTransition] = useTransition()

  const navigation = [
    { name: t('home'), href: '/' as const },
    { name: t('properties'), href: '/properties' as const },
    {
      name: t('destinations'),
      href: '#' as const,
      submenu: [
        { name: t('europe'), href: '/reiseziele/europa' as const },
        { name: t('asia'), href: '/reiseziele/asien' as const },
        { name: t('americas'), href: '/reiseziele/amerika' as const },
        { name: t('africa'), href: '/reiseziele/afrika' as const },
      ],
    },
    { name: t('offers'), href: '/angebote' as const },
    { name: t('about'), href: '/ueber-uns' as const },
    { name: t('contact'), href: '/kontakt' as const },
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    startMenuTransition(() => {
      setIsMobileMenuOpen(false)
      setIsUserMenuOpen(false)
    })
  }, [pathname, startMenuTransition])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    if (isUserMenuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isUserMenuOpen])

  const handleSignOut = async () => {
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
    setIsUserMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : (user?.email?.[0] || 'U').toUpperCase()

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md transition-all duration-300 ${
        isScrolled ? 'shadow-lg shadow-gray-200/40 border-b border-gray-100/50' : 'border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo
              platformName={platformName}
              logoLightUrl={logoLightUrl}
              logoDarkUrl={logoDarkUrl}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => setActiveSubmenu(item.name)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                {item.submenu ? (
                  <button className={`px-3.5 py-2 text-sm font-medium rounded-lg flex items-center gap-1 transition-colors duration-150 ${
                    activeSubmenu === item.name ? 'text-primary bg-primary/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}>
                    {item.name}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeSubmenu === item.name ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                      pathname === item.href
                        ? 'text-primary bg-primary/5'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}

                {item.submenu && activeSubmenu === item.name && (
                  <div className="absolute left-0 top-full pt-2 z-50">
                    <div className="w-52 rounded-xl bg-white shadow-xl shadow-gray-200/50 border border-gray-100 py-2 animate-slide-up">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          className={`block px-4 py-2.5 text-sm transition-colors duration-150 ${
                            pathname === subitem.href
                              ? 'text-primary bg-primary/5 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full transition-all duration-200 ${
                    isUserMenuOpen ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {profile?.full_name || user.email}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-white shadow-xl shadow-gray-200/50 border border-gray-100 py-2 animate-slide-up">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {t('dashboard')}
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        {t('admin')}
                      </Link>
                    )}
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      {t('settings')}
                    </Link>
                    <div className="my-1 mx-3 border-t border-gray-100" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('signIn')}
                </Link>
                <Link href="/auth?mode=register" className="btn-primary text-sm">
                  {t('register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-slide-up">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() =>
                        setActiveSubmenu(activeSubmenu === item.name ? null : item.name)
                      }
                      className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeSubmenu === item.name ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {activeSubmenu === item.name && (
                      <div className="ml-3 pl-3 border-l-2 border-gray-100 space-y-1 py-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            className={`block py-2 px-3 text-sm rounded-lg transition-colors ${
                              pathname === subitem.href
                                ? 'text-primary bg-primary/5 font-medium'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`block py-2.5 px-3 text-sm font-medium rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'text-primary bg-primary/5'
                        : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-4 mt-4 border-t border-gray-100">
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 px-3 py-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {initials}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {profile?.full_name || user.email}
                    </span>
                  </div>
                  <Link href="/dashboard" className="block py-2.5 px-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg">
                    {t('dashboard')}
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="block py-2.5 px-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg">
                      {t('admin')}
                    </Link>
                  )}
                  <Link href="/dashboard/settings" className="block py-2.5 px-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg">
                    {t('settings')}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left py-2.5 px-3 text-sm text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    {t('signOut')}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth"
                    className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg"
                  >
                    {t('signIn')}
                  </Link>
                  <Link href="/auth?mode=register" className="block w-full btn-primary text-center">
                    {t('register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
